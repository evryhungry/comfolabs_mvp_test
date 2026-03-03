export const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL || 'gpt-4o',
  imageModel: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1',
  imageSize: (process.env.OPENAI_IMAGE_SIZE || '1024x1024') as
    | '1024x1024'
    | '1536x1024'
    | '1024x1536'
    | 'auto',
  maxTokens: Number(process.env.OPENAI_MAX_TOKENS) || 4096,
  temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
  timeout: 120000,
  maxRetries: 3,
};
