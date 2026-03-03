<script setup lang="ts">
import { ref } from 'vue'
import type { Moodboard } from '../model/Moodboard'

defineProps<{
  moodboard: Moodboard | null
}>()

const emit = defineEmits<{
  upload: [files: File[]]
}>()

const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const files = Array.from(e.dataTransfer?.files || [])
  if (files.length > 0) emit('upload', files)
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  if (files.length > 0) emit('upload', files)
  input.value = ''
}
</script>

<template>
  <div class="moodboard-editor">
    <h3 class="section-title">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
      Moodboard
      <span v-if="moodboard" class="count-badge">{{ moodboard.imageUrls.length }}</span>
    </h3>

    <!-- Upload Zone (shown when no moodboard or to add more) -->
    <div
      class="drop-zone"
      :class="{ dragging: isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      @click="fileInputRef?.click()"
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="drop-icon">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
      </svg>
      <p class="drop-text">Add reference images for style and mood</p>
      <p class="drop-hint">Drop multiple images or click to browse</p>
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        multiple
        class="file-input-hidden"
        @change="handleFileChange"
      />
    </div>

    <!-- Image Gallery -->
    <div v-if="moodboard && moodboard.imageUrls.length > 0" class="image-gallery">
      <div v-for="(url, idx) in moodboard.imageUrls" :key="idx" class="gallery-item">
        <img :src="url" alt="moodboard reference" />
      </div>
    </div>

    <!-- Characteristics -->
    <div v-if="moodboard?.characteristics" class="characteristics">
      <span class="char-label">Style Notes</span>
      <p class="char-text">{{ moodboard.characteristics }}</p>
    </div>

    <!-- Combined URL -->
    <div v-if="moodboard?.combinedUrl" class="combined-preview">
      <span class="char-label">Combined Moodboard</span>
      <div class="combined-thumb">
        <img :src="moodboard.combinedUrl" alt="combined moodboard" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.moodboard-editor {
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

/* Gallery */
.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
}

.gallery-item {
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-border-light);
  border: 1px solid var(--color-border-light);
  transition: all var(--transition);
}

.gallery-item:hover {
  border-color: var(--color-primary-subtle);
  box-shadow: var(--shadow-sm);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Characteristics */
.characteristics {
  padding: 12px 14px;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
}

.char-label {
  display: block;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  font-weight: 600;
  margin-bottom: 6px;
}

.char-text {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* Combined */
.combined-preview {
  padding: 12px 14px;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
}

.combined-thumb {
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-top: 8px;
}

.combined-thumb img {
  width: 100%;
  border-radius: var(--radius-sm);
}
</style>
