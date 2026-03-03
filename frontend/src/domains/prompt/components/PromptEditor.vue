<script setup lang="ts">
import { ref } from 'vue'
import type { PromptTemplate } from '../model/Prompt'
import BaseButton from '../../../components/BaseButton.vue'

defineProps<{
  templates: PromptTemplate[]
}>()

const emit = defineEmits<{
  submit: [payload: { templateId?: string; userInput: string }]
}>()

const selectedTemplateId = ref<string>('')
const userInput = ref('')

function handleSubmit() {
  if (!userInput.value.trim()) return
  emit('submit', {
    templateId: selectedTemplateId.value || undefined,
    userInput: userInput.value,
  })
}
</script>

<template>
  <div class="prompt-editor">
    <h3 class="section-title">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
      Prompt
    </h3>

    <!-- Template Select -->
    <div class="field-group">
      <label class="field-label">Prompt Template</label>
      <div class="select-wrapper">
        <select v-model="selectedTemplateId" class="select-field">
          <option value="">Default (no template)</option>
          <option v-for="t in templates" :key="t.id" :value="t.id">
            {{ t.name }} (v{{ t.version }})
          </option>
        </select>
        <svg class="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>

    <!-- User Input -->
    <div class="field-group">
      <label class="field-label">Design Requirements</label>
      <textarea
        v-model="userInput"
        class="textarea-field"
        placeholder="Describe your desired look, materials, finish, colors...&#10;e.g. Matte black finish with brushed aluminum accents"
        rows="5"
      />
      <span class="field-hint">{{ userInput.length }} characters</span>
    </div>

    <!-- Submit -->
    <BaseButton
      label="Generate Rendering"
      size="lg"
      :disabled="!userInput.trim()"
      @click="handleSubmit"
    />
  </div>
</template>

<style scoped>
.prompt-editor {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

/* Field Group */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.field-hint {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
  text-align: right;
}

/* Select */
.select-wrapper {
  position: relative;
}

.select-field {
  width: 100%;
  padding: 10px 36px 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--color-text);
  background: var(--color-surface);
  appearance: none;
  outline: none;
  cursor: pointer;
  transition: all var(--transition);
}

.select-field:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  pointer-events: none;
}

/* Textarea */
.textarea-field {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--color-text);
  background: var(--color-surface);
  resize: vertical;
  outline: none;
  transition: all var(--transition);
  line-height: 1.6;
  min-height: 100px;
}

.textarea-field::placeholder {
  color: var(--color-text-muted);
}

.textarea-field:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}
</style>
