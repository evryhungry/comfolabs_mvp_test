<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
  label?: string
  error?: string
  type?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="input-group" :class="{ 'input-group--error': error }">
    <label v-if="label" class="input-label">{{ label }}</label>
    <input
      class="input-field"
      :type="type || 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="input-error">{{ error }}</span>
  </div>
</template>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.input-field {
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--color-text);
  background: var(--color-surface);
  transition: all var(--transition);
  outline: none;
}

.input-field::placeholder {
  color: var(--color-text-muted);
}

.input-field:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.input-group--error .input-field {
  border-color: var(--color-danger);
}

.input-group--error .input-field:focus {
  box-shadow: 0 0 0 3px var(--color-danger-light);
}

.input-error {
  font-size: 0.75rem;
  color: var(--color-danger);
}
</style>
