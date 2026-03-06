import { PromptDomainService, BASE_SYSTEM_PROMPT_V1 } from '../../../../src/domain/prompt/service/prompt-domain.service.js';

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

    it('should place components in correct order: system → moodboard → sketch → user', () => {
      const result = service.buildFinalPrompt('SYSTEM', 'USER_INPUT');

      const systemIdx = result.indexOf('SYSTEM');
      const moodboardIdx = result.indexOf('Refer to the attached moodboard');
      const sketchIdx = result.indexOf('Use the attached sketch(es)');
      const userIdx = result.indexOf('USER_INPUT');

      expect(systemIdx).toBeLessThan(moodboardIdx);
      expect(moodboardIdx).toBeLessThan(sketchIdx);
      expect(sketchIdx).toBeLessThan(userIdx);
    });

    it('should handle empty user input gracefully', () => {
      const result = service.buildFinalPrompt('SYSTEM', '');
      expect(result).toContain('SYSTEM');
    });
  });

  describe('buildSystemPromptOnly', () => {
    it('should return system prompt as-is', () => {
      const prompt = 'System prompt content';
      expect(service.buildSystemPromptOnly(prompt)).toBe(prompt);
    });
  });

  describe('BASE_SYSTEM_PROMPT_V1', () => {
    it('should contain all 6 view references for multi-view rendering', () => {
      expect(BASE_SYSTEM_PROMPT_V1).toContain('[FRONT]');
      expect(BASE_SYSTEM_PROMPT_V1).toContain('[LEFT]');
      expect(BASE_SYSTEM_PROMPT_V1).toContain('[RIGHT]');
      expect(BASE_SYSTEM_PROMPT_V1).toContain('[BACK]');
      expect(BASE_SYSTEM_PROMPT_V1).toContain('[TOP]');
      expect(BASE_SYSTEM_PROMPT_V1).toContain('PERSPECTIVE');
    });

    it('should contain 2x3 grid layout instruction', () => {
      expect(BASE_SYSTEM_PROMPT_V1).toContain('2x3');
    });

    it('should contain consistent geometry rule', () => {
      expect(BASE_SYSTEM_PROMPT_V1).toContain('Consistent Geometry');
    });
  });
});
