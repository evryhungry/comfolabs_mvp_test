import { jest } from '@jest/globals';
import { GeminiClient } from './gemini.client.js';

// Mock the @google/genai SDK
const mockGenerateContent = jest.fn();

jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent,
    },
  })),
}));

describe('GeminiClient', () => {
  let client: GeminiClient;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new GeminiClient();
  });

  describe('generateImage', () => {
    const systemPrompt = 'You are a designer.';
    const userPrompt = 'Matte black finish';
    const sketchBase64 = 'data:image/png;base64,abc123';
    const moodboardBase64 = 'data:image/png;base64,def456';

    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                inlineData: {
                  data: 'base64encodedimagedata',
                  mimeType: 'image/png',
                },
              },
              {
                text: 'Here is the rendered image.',
              },
            ],
          },
        },
      ],
      usageMetadata: {
        promptTokenCount: 1520,
        candidatesTokenCount: 800,
        totalTokenCount: 2320,
      },
    };

    it('should call Gemini with correct message structure', async () => {
      mockGenerateContent.mockResolvedValueOnce(mockResponse);

      await client.generateImage(
        systemPrompt,
        userPrompt,
        sketchBase64,
        moodboardBase64,
      );

      expect(mockGenerateContent).toHaveBeenCalledTimes(1);

      const args = mockGenerateContent.mock.calls[0][0];
      expect(args.contents).toHaveLength(1);
      expect(args.contents[0].role).toBe('user');
      expect(args.contents[0].parts).toHaveLength(3);
      expect(args.contents[0].parts[0].text).toBe(userPrompt);
      expect(args.contents[0].parts[1].inlineData).toBeDefined();
      expect(args.contents[0].parts[2].inlineData).toBeDefined();
      expect(args.config.systemInstruction).toContain(systemPrompt);
      expect(args.config.responseModalities).toEqual(['IMAGE', 'TEXT']);
    });

    it('should return metadata with token usage', async () => {
      mockGenerateContent.mockResolvedValueOnce(mockResponse);

      const result = await client.generateImage(
        systemPrompt,
        userPrompt,
        sketchBase64,
        moodboardBase64,
      );

      expect(result.metadata.promptTokens).toBe(1520);
      expect(result.metadata.completionTokens).toBe(800);
      expect(result.metadata.totalTokens).toBe(2320);
    });

    it('should return base64 image data and text', async () => {
      mockGenerateContent.mockResolvedValueOnce(mockResponse);

      const result = await client.generateImage(
        systemPrompt,
        userPrompt,
        sketchBase64,
        moodboardBase64,
      );

      expect(result.imageBase64).toBe('base64encodedimagedata');
      expect(result.resultUrl).toBeNull();
      expect(result.textResponse).toBe('Here is the rendered image.');
    });

    it('should throw error when no image data returned', async () => {
      mockGenerateContent.mockResolvedValueOnce({
        candidates: [{ content: { parts: [{ text: 'no image' }] } }],
        usageMetadata: {
          promptTokenCount: 0,
          candidatesTokenCount: 0,
          totalTokenCount: 0,
        },
      });

      await expect(
        client.generateImage(
          systemPrompt,
          userPrompt,
          sketchBase64,
          moodboardBase64,
        ),
      ).rejects.toThrow('Gemini did not return image data');
    });

    it('should retry on 429 rate limit error', async () => {
      const rateLimitError = new Error('Rate limit exceeded');
      (rateLimitError as any).status = 429;

      mockGenerateContent
        .mockRejectedValueOnce(rateLimitError)
        .mockResolvedValueOnce(mockResponse);

      const result = await client.generateImage(
        systemPrompt,
        userPrompt,
        sketchBase64,
        moodboardBase64,
      );

      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
      expect(result.imageBase64).toBe('base64encodedimagedata');
    });

    it('should throw error after all retries fail', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Persistent failure'));

      await expect(
        client.generateImage(
          systemPrompt,
          userPrompt,
          sketchBase64,
          moodboardBase64,
        ),
      ).rejects.toThrow('Persistent failure');
    });
  });
});
