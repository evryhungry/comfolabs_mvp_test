import { PromptDomainService, BASE_SYSTEM_PROMPT_V1 } from './prompt-domain.service.js';

describe('PromptDomainService', () => {
  let service: PromptDomainService;

  beforeEach(() => {
    service = new PromptDomainService();
  });

  describe('buildFinalPrompt', () => {
    it('should compose final prompt with system prompt + moodboard context + sketch context + user input', () => {
      const systemPrompt = 'You are a designer.';
      const userInput = 'Matte black finish with brushed aluminum.';

      const result = service.buildFinalPrompt(systemPrompt, userInput);

      expect(result).toContain('You are a designer.');
      expect(result).toContain('Refer to the attached moodboard');
      expect(result).toContain('Use the attached sketch(es)');
      expect(result).toContain('Matte black finish with brushed aluminum.');
    });

    it('should place components in correct order', () => {
      const result = service.buildFinalPrompt('SYSTEM', 'USER_INPUT');

      const systemIdx = result.indexOf('SYSTEM');
      const moodboardIdx = result.indexOf('Refer to the attached moodboard');
      const sketchIdx = result.indexOf('Use the attached sketch(es)');
      const userIdx = result.indexOf('USER_INPUT');

      expect(systemIdx).toBeLessThan(moodboardIdx);
      expect(moodboardIdx).toBeLessThan(sketchIdx);
      expect(sketchIdx).toBeLessThan(userIdx);
    });
  });

  describe('buildSystemPromptOnly', () => {
    it('should return system prompt as-is', () => {
      const prompt = 'System prompt content';
      expect(service.buildSystemPromptOnly(prompt)).toBe(prompt);
    });
  });

  describe('BASE_SYSTEM_PROMPT_V1', () => {
    it('should contain key rendering instructions', () => {
      expect(BASE_SYSTEM_PROMPT_V1).toContain('multi-view render sheet');
      expect(BASE_SYSTEM_PROMPT_V1).toContain('Front');
      expect(BASE_SYSTEM_PROMPT_V1).toContain('Left');
      expect(BASE_SYSTEM_PROMPT_V1).toContain('Right');
      expect(BASE_SYSTEM_PROMPT_V1).toContain('Back');
      expect(BASE_SYSTEM_PROMPT_V1).toContain('Perspective');
    });

    it('should contain safety constraints', () => {
      expect(BASE_SYSTEM_PROMPT_V1).toContain('Safety constraints');
    });
  });
});
