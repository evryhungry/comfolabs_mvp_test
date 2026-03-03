export const geminiConfig = {
  apiKey: process.env.GEMINI_API_KEY || '',
  model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  imageModel: process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image-preview',
  maxTokens: Number(process.env.GEMINI_MAX_TOKENS) || 4096,
  temperature: Number(process.env.GEMINI_TEMPERATURE) || 0.7,
  timeout: 120000,
  maxRetries: 3,
};
