import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { openaiConfig } from '../config/openai.config.js';

export interface OpenAIRenderingResult {
  imageBase64: string | null;
  resultUrl: string | null;
  textResponse: string;
  metadata: {
    model: string;
    imageModel: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    createdAt: string;
  };
}

@Injectable()
export class OpenAIClient {
  private readonly logger = new Logger(OpenAIClient.name);
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: openaiConfig.apiKey,
      timeout: openaiConfig.timeout,
    });
  }

  async generateImage(
    systemPrompt: string,
    userPrompt: string,
    sketchImageBase64: string,
    moodboardImageBase64: string,
  ): Promise<OpenAIRenderingResult> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= openaiConfig.maxRetries; attempt++) {
      try {
        // Step 1: GPT-4o Vision → detailed image generation prompt
        const { imagePrompt, metadata } = await this.analyzeForImagePrompt(
          systemPrompt,
          userPrompt,
          sketchImageBase64,
          moodboardImageBase64,
        );

        this.logger.log(
          `Step 1 complete: generated image prompt (${imagePrompt.length} chars)`,
        );

        // Step 2: gpt-image-1 → actual image generation
        const imageBase64 = await this.generateImageFromPrompt(imagePrompt);

        this.logger.log('Step 2 complete: image generated successfully');

        return {
          imageBase64,
          resultUrl: null,
          textResponse: imagePrompt,
          metadata: {
            ...metadata,
            imageModel: openaiConfig.imageModel,
          },
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.logger.warn(
          `OpenAI API attempt ${attempt}/${openaiConfig.maxRetries} failed: ${lastError.message}`,
        );

        if (this.isRetryable(error) && attempt < openaiConfig.maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          await this.sleep(delay);
          continue;
        }

        break;
      }
    }

    throw lastError || new Error('OpenAI API call failed');
  }

  /**
   * Step 1: Use GPT-4o Vision to analyze sketch + moodboard
   * and produce a detailed English image-generation prompt.
   */
  private async analyzeForImagePrompt(
    systemPrompt: string,
    userPrompt: string,
    sketchImageBase64: string,
    moodboardImageBase64: string,
  ): Promise<{
    imagePrompt: string;
    metadata: {
      model: string;
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
      createdAt: string;
    };
  }> {
    const imagePromptInstruction = `

IMPORTANT INSTRUCTION:
Do NOT generate an image yourself. Instead, analyze the provided sketch and moodboard images along with the user's requirements, then output a single, highly detailed English prompt that can be passed to an image generation model (gpt-image-1) to produce the final rendered image.

The prompt you generate should:
- Describe the product's form, proportions, and key design features from the sketch
- Incorporate CMF (color, material, finish) and styling cues from the moodboard
- Include specific lighting, camera angle, and rendering style instructions
- Request a multi-view render sheet layout (Front, Left, Right, Back, 45° Perspective)
- Specify photoreal/CGI quality with studio lighting on a neutral background
- Be comprehensive and self-contained (the image model won't see the original images)

Output ONLY the image generation prompt text, nothing else.`;

    const response = await this.client.chat.completions.create({
      model: openaiConfig.model,
      messages: [
        {
          role: 'system',
          content: systemPrompt + imagePromptInstruction,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userPrompt,
            },
            {
              type: 'image_url',
              image_url: { url: sketchImageBase64 },
            },
            {
              type: 'image_url',
              image_url: { url: moodboardImageBase64 },
            },
          ],
        },
      ],
      max_tokens: openaiConfig.maxTokens,
      temperature: openaiConfig.temperature,
    });

    const choice = response.choices[0];
    const imagePrompt = choice?.message?.content?.trim() || '';

    if (!imagePrompt) {
      throw new Error('GPT-4o returned empty image prompt');
    }

    return {
      imagePrompt,
      metadata: {
        model: response.model,
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
        createdAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Step 2: Use gpt-image-1 to generate the actual rendered image
   * from the detailed prompt produced in Step 1.
   */
  private async generateImageFromPrompt(prompt: string): Promise<string> {
    const response = await this.client.images.generate({
      model: openaiConfig.imageModel,
      prompt,
      n: 1,
      size: openaiConfig.imageSize,
    });

    const imageData = response.data?.[0];

    if (!imageData?.b64_json) {
      throw new Error('gpt-image-1 did not return base64 image data');
    }

    return imageData.b64_json;
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
