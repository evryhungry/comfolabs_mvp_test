import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { geminiConfig } from '../config/gemini.config.js';

export interface GeminiRenderingResult {
  imageBase64: string | null;
  resultUrl: string | null;
  textResponse: string;
  metadata: {
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    createdAt: string;
  };
}

@Injectable()
export class GeminiClient {
  private readonly logger = new Logger(GeminiClient.name);
  private readonly client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({ apiKey: geminiConfig.apiKey });
  }

  async generateImage(
    systemPrompt: string,
    userPrompt: string,
    sketchImageBase64: string,
    moodboardImageBase64: string,
  ): Promise<GeminiRenderingResult> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= geminiConfig.maxRetries; attempt++) {
      try {
        const sketch = this.parseBase64Image(sketchImageBase64);
        const moodboard = this.parseBase64Image(moodboardImageBase64);

        const response = await this.client.models.generateContent({
          model: geminiConfig.imageModel,
          contents: [
            {
              role: 'user',
              parts: [
                { text: userPrompt },
                {
                  inlineData: {
                    data: sketch.data,
                    mimeType: sketch.mimeType,
                  },
                },
                {
                  inlineData: {
                    data: moodboard.data,
                    mimeType: moodboard.mimeType,
                  },
                },
              ],
            },
          ],
          config: {
            systemInstruction: systemPrompt,
            responseModalities: ['IMAGE', 'TEXT'],
            temperature: geminiConfig.temperature,
          },
        });

        // Extract image and text from response
        const parts = response.candidates?.[0]?.content?.parts || [];
        let imageBase64: string | null = null;
        let textResponse = '';

        for (const part of parts) {
          if (part.inlineData) {
            imageBase64 = part.inlineData.data || null;
          }
          if (part.text) {
            textResponse += part.text;
          }
        }

        if (!imageBase64) {
          throw new Error('Gemini did not return image data');
        }

        this.logger.log(
          `Image generated successfully (prompt: ${response.usageMetadata?.promptTokenCount || 0}, completion: ${response.usageMetadata?.candidatesTokenCount || 0}, total: ${response.usageMetadata?.totalTokenCount || 0})`,
        );

        return {
          imageBase64,
          resultUrl: null,
          textResponse,
          metadata: {
            model: geminiConfig.imageModel,
            promptTokens: response.usageMetadata?.promptTokenCount || 0,
            completionTokens:
              response.usageMetadata?.candidatesTokenCount || 0,
            totalTokens: response.usageMetadata?.totalTokenCount || 0,
            createdAt: new Date().toISOString(),
          },
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.logger.warn(
          `Gemini API attempt ${attempt}/${geminiConfig.maxRetries} failed: ${lastError.message}`,
        );

        if (this.isRetryable(error) && attempt < geminiConfig.maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          await this.sleep(delay);
          continue;
        }

        break;
      }
    }

    throw lastError || new Error('Gemini API call failed');
  }

  private parseBase64Image(dataUrl: string): {
    data: string;
    mimeType: string;
  } {
    if (dataUrl.startsWith('data:')) {
      const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/s);
      if (match) {
        return { mimeType: match[1], data: match[2] };
      }
    }
    // If it's already raw base64 or a URL, return as-is
    return { mimeType: 'image/png', data: dataUrl };
  }

  private isRetryable(error: unknown): boolean {
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as { status: number }).status;
      return [429, 500, 502, 503].includes(status);
    }
    if (error instanceof Error && error.message.includes('timeout')) {
      return true;
    }
    return false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
