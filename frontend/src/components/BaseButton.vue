<script setup lang="ts">
defineProps<{
  label: string
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="btn"
    :class="[
      `btn--${variant || 'primary'}`,
      `btn--${size || 'md'}`,
      { 'btn--loading': loading },
    ]"
    :disabled="disabled || loading"
    @click="emit('click')"
  >
    <span v-if="loading" class="btn-spinner"></span>
    <span class="btn-label">{{ label }}</span>
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-weight: 600;
  white-space: nowrap;
  transition: all var(--transition);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sizes */
.btn--sm {
  padding: 6px 14px;
  font-size: 0.8125rem;
  border-radius: var(--radius-sm);
}

.btn--md {
  padding: 10px 20px;
  font-size: 0.875rem;
}

.btn--lg {
  padding: 14px 28px;
  font-size: 1rem;
}

/* Variants */
.btn--primary {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.btn--primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
  transform: translateY(-1px);
}

.btn--primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: none;
}

.btn--secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-border);
}

.btn--secondary:hover:not(:disabled) {
  background: var(--color-bg);
  border-color: var(--color-text-muted);
}

.btn--danger {
  background: var(--color-danger);
  color: #fff;
  border-color: var(--color-danger);
}

.btn--danger:hover:not(:disabled) {
  background: #dc2626;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.35);
  transform: translateY(-1px);
}

.btn--ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border-color: transparent;
}

.btn--ghost:hover:not(:disabled) {
  background: var(--color-bg);
  color: var(--color-text);
}

/* Loading */
.btn--loading .btn-label {
  opacity: 0.6;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
