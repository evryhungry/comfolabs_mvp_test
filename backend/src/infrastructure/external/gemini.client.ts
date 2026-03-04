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

  /**
   * Step 1: Vision model analyzes the sketch and extracts detailed geometry description.
   */
  private async analyzeSketch(
    sketchImageBase64: string,
    moodboardImageBase64: string,
    userPrompt: string,
  ): Promise<string> {
    const sketch = this.parseBase64Image(sketchImageBase64);
    const moodboard = this.parseBase64Image(moodboardImageBase64);

    const analysisPrompt = `You are a senior industrial designer. Analyze this product sketch in extreme detail.

Describe the following with precision:
1. **Overall silhouette**: exact shape category (cylindrical, rectangular, organic, etc.), aspect ratio, height-to-width proportion
2. **Geometric breakdown**: describe each section of the form (top, middle, bottom) with exact curves, angles, tapers, and transitions
3. **Key design features**: any grooves, ridges, openings, buttons, interfaces, vents, seams, parting lines
4. **Proportional relationships**: relative sizes between sections (e.g., "the cap is 15% of total height")
5. **Edge treatment**: sharp vs rounded, radius descriptions
6. **Surface topology**: flat, convex, concave, compound curves

Be extremely specific about geometry. Use measurable descriptions like "gently tapered cylinder narrowing from 100% width at base to 85% at top" rather than vague terms.

User's design intent for context: ${userPrompt || 'No specific requirements provided. Apply professional CMF autonomously based on the product category.'}`;

    const response = await this.client.models.generateContent({
      model: geminiConfig.model, // Vision model (gemini-2.5-flash)
      contents: [
        {
          role: 'user',
          parts: [
            { text: analysisPrompt },
            { text: '[SKETCH IMAGE]:' },
            {
              inlineData: {
                data: sketch.data,
                mimeType: sketch.mimeType,
              },
            },
            { text: '[MOODBOARD IMAGE] for material/finish context only:' },
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
        temperature: 0.3,
      },
    });

    const analysisText = response.candidates?.[0]?.content?.parts
      ?.map((p) => p.text)
      .filter(Boolean)
      .join('') || '';

    this.logger.log(`[Step 1] Sketch analysis completed (${analysisText.length} chars)`);
    this.logger.debug(`[Step 1] Analysis: ${analysisText.substring(0, 300)}...`);

    return analysisText;
  }

  /**
   * Step 2: Image generation model creates the render using sketch analysis + reference images.
   * Layout is controlled entirely by the system prompt.
   */
  async generateImage(
    systemPrompt: string,
    userPrompt: string,
    sketchImageBase64: string,
    moodboardImageBase64: string,
  ): Promise<GeminiRenderingResult> {
    let lastError: Error | null = null;

    // Step 1: Analyze sketch geometry with vision model
    let sketchAnalysis: string;
    try {
      sketchAnalysis = await this.analyzeSketch(sketchImageBase64, moodboardImageBase64, userPrompt);
    } catch (error) {
      this.logger.warn(`Sketch analysis failed, proceeding without: ${error}`);
      sketchAnalysis = '';
    }

    for (let attempt = 1; attempt <= geminiConfig.maxRetries; attempt++) {
      try {
        const sketch = this.parseBase64Image(sketchImageBase64);
        const moodboard = this.parseBase64Image(moodboardImageBase64);

        // Build enhanced prompt that includes the sketch geometry analysis
        const enhancedUserPrompt = `
[CRITICAL: SKETCH GEOMETRY ANALYSIS]
The following is a precise geometric analysis of the sketch you must follow. This defines the EXACT shape, proportions, and form of the product. Do NOT deviate from these specifications:

${sketchAnalysis}

---

[SKETCH IMAGE] The image below is the original sketch. Match its silhouette, proportions, and features EXACTLY:`;

        const response = await this.client.models.generateContent({
          model: geminiConfig.imageModel,
          contents: [
            {
              role: 'user',
              parts: [
                { text: enhancedUserPrompt },
                {
                  inlineData: {
                    data: sketch.data,
                    mimeType: sketch.mimeType,
                  },
                },
                { text: `[MOODBOARD] Use this moodboard ONLY for color, material, finish, and lighting reference. Do NOT alter the product shape:` },
                {
                  inlineData: {
                    data: moodboard.data,
                    mimeType: moodboard.mimeType,
                  },
                },
                { text: `[USER REQUIREMENTS - apply to CMF/lighting/mood only, NOT shape] ${userPrompt || 'No specific requirements. Apply professional, trending CMF autonomously based on the product category.'}` },
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
          `[Step 2] Image generated successfully (prompt: ${response.usageMetadata?.promptTokenCount || 0}, completion: ${response.usageMetadata?.candidatesTokenCount || 0}, total: ${response.usageMetadata?.totalTokenCount || 0})`,
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
