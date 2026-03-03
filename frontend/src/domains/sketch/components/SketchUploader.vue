<script setup lang="ts">
import { ref } from 'vue'
import type { Sketch } from '../model/Sketch'

defineProps<{
  sketches: Sketch[]
}>()

const emit = defineEmits<{
  upload: [file: File]
  remove: [id: string]
}>()

const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) emit('upload', file)
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) emit('upload', file)
  input.value = ''
}
</script>

<template>
  <div class="sketch-uploader">
    <h3 class="section-title">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
      Sketches
      <span class="count-badge">{{ sketches.length }}</span>
    </h3>

    <!-- Upload Zone -->
    <div
      class="drop-zone"
      :class="{ dragging: isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      @click="fileInputRef?.click()"
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="drop-icon">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
      <p class="drop-text">Drop sketch files here or click to browse</p>
      <p class="drop-hint">PNG, JPG up to 20MB</p>
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        multiple
        class="file-input-hidden"
        @change="handleFileChange"
      />
    </div>

    <!-- Sketch List -->
    <div v-if="sketches.length > 0" class="sketch-list">
      <div v-for="sketch in sketches" :key="sketch.id" class="sketch-item">
        <div class="sketch-thumb">
          <img :src="sketch.imageUrl" :alt="sketch.filename" />
        </div>
        <div class="sketch-info">
          <span class="sketch-name">{{ sketch.filename }}</span>
          <span class="sketch-order">Order: {{ sketch.sortOrder }}</span>
        </div>
        <button class="remove-btn" title="Remove" @click="emit('remove', sketch.id)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sketch-uploader {
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

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Drop Zone */
.drop-zone {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition);
  background: var(--color-bg);
}

.drop-zone:hover {
  border-color: var(--color-primary-subtle);
  background: var(--color-primary-light);
}

.drop-zone.dragging {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.drop-icon {
  color: var(--color-text-muted);
  margin-bottom: 8px;
}

.drop-text {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.drop-hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.file-input-hidden {
  display: none;
}

/* Sketch List */
.sketch-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sketch-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  transition: all var(--transition);
}

.sketch-item:hover {
  border-color: var(--color-border);
}

.sketch-thumb {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-border-light);
}

.sketch-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sketch-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sketch-name {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sketch-order {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
}

.remove-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition);
}

.remove-btn:hover {
  background: var(--color-danger-light);
  color: var(--color-danger);
}
</style>
