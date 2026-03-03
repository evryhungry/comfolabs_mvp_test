<script setup lang="ts">
import { ref } from 'vue'
import type { Rendering } from '../model/Rendering'
import { RenderingStatus } from '../model/Rendering'

const props = defineProps<{
  rendering: Rendering
}>()

const lightboxOpen = ref(false)

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function openLightbox() {
  lightboxOpen.value = true
}

function closeLightbox() {
  lightboxOpen.value = false
}

async function downloadImage() {
  if (!props.rendering.resultUrl) return
  try {
    const response = await fetch(props.rendering.resultUrl)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rendering-${props.rendering.id}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch {
    // fallback: open in new tab
    window.open(props.rendering.resultUrl, '_blank')
  }
}

function openInNewTab() {
  if (!props.rendering.resultUrl) return
  window.open(props.rendering.resultUrl, '_blank')
}
</script>

<template>
  <div class="rendering-card" :class="`status--${rendering.status.toLowerCase()}`">
    <!-- Status Badge -->
    <div class="card-header">
      <span class="status-badge">
        <span class="status-dot"></span>
        {{ rendering.status }}
      </span>
      <span class="render-date">{{ formatDate(rendering.createdAt) }}</span>
    </div>

    <!-- Pending -->
    <div v-if="rendering.status === RenderingStatus.PENDING" class="card-body state-pending">
      <div class="pending-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>
      <p>Waiting to start...</p>
    </div>

    <!-- Processing -->
    <div v-else-if="rendering.status === RenderingStatus.PROCESSING" class="card-body state-processing">
      <div class="processing-animation">
        <div class="pulse-ring"></div>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
        </svg>
      </div>
      <p>Generating your rendering...</p>
    </div>

    <!-- Completed -->
    <div v-else-if="rendering.status === RenderingStatus.COMPLETED" class="card-body state-completed">
      <div v-if="rendering.resultUrl" class="result-image" @click="openLightbox">
        <img :src="rendering.resultUrl" alt="rendering result" />
        <div class="image-hover-overlay">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </div>
      </div>
      <div v-else class="no-image">
        <p>Completed but no image URL returned</p>
      </div>
      <div class="result-meta">
        <span class="meta-chip">{{ rendering.viewType }}</span>
        <div v-if="rendering.resultUrl" class="image-actions">
          <button class="action-btn" title="Download image" @click="downloadImage">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download
          </button>
          <button class="action-btn" title="Open in new tab" @click="openInNewTab">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            New Tab
          </button>
        </div>
      </div>
    </div>

    <!-- Failed -->
    <div v-else-if="rendering.status === RenderingStatus.FAILED" class="card-body state-failed">
      <div class="error-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <p class="error-msg">{{ rendering.errorMessage || 'Rendering failed unexpectedly' }}</p>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <div v-if="lightboxOpen && rendering.resultUrl" class="lightbox-overlay" @click.self="closeLightbox">
        <div class="lightbox-content">
          <img :src="rendering.resultUrl" alt="rendering result full" />
          <div class="lightbox-toolbar">
            <button class="lightbox-btn" @click="downloadImage">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download
            </button>
            <button class="lightbox-btn" @click="openInNewTab">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              New Tab
            </button>
            <button class="lightbox-btn lightbox-close" @click="closeLightbox">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.rendering-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition);
}

.rendering-card:hover {
  box-shadow: var(--shadow-sm);
}

/* Header */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status--pending .status-badge { color: var(--color-text-muted); }
.status--pending .status-dot { background: var(--color-text-muted); }

.status--processing .status-badge { color: var(--color-warning); }
.status--processing .status-dot { background: var(--color-warning); animation: pulse 1.5s infinite; }

.status--completed .status-badge { color: var(--color-success); }
.status--completed .status-dot { background: var(--color-success); }

.status--failed .status-badge { color: var(--color-danger); }
.status--failed .status-dot { background: var(--color-danger); }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.render-date {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
}

/* Body */
.card-body {
  padding: 24px 16px;
}

/* Pending */
.state-pending {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--color-text-muted);
  text-align: center;
}

.pending-icon { opacity: 0.5; }

/* Processing */
.state-processing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--color-warning);
  text-align: center;
}

.processing-animation {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse-ring {
  position: absolute;
  width: 56px;
  height: 56px;
  border: 2px solid var(--color-warning);
  border-radius: 50%;
  animation: pulseRing 1.5s ease-out infinite;
}

@keyframes pulseRing {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(1.4); opacity: 0; }
}

/* Completed */
.state-completed {
  padding: 0;
}

.result-image {
  position: relative;
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
}

.result-image img {
  width: 100%;
  display: block;
}

.image-hover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  opacity: 0;
  transition: opacity 0.2s ease;
  color: #fff;
}

.result-image:hover .image-hover-overlay {
  opacity: 1;
}

.no-image {
  padding: 32px 16px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.result-meta {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-chip {
  display: inline-block;
  padding: 3px 10px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.image-actions {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn:hover {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

/* Lightbox */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  padding: 24px;
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.lightbox-content img {
  max-width: 100%;
  max-height: calc(90vh - 60px);
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
}

.lightbox-toolbar {
  display: flex;
  gap: 8px;
}

.lightbox-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.lightbox-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.lightbox-close:hover {
  background: rgba(239, 68, 68, 0.6);
  border-color: rgba(239, 68, 68, 0.8);
}

/* Failed */
.state-failed {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.error-icon { color: var(--color-danger); }

.error-msg {
  font-size: 0.8125rem;
  color: var(--color-danger);
  max-width: 280px;
}
</style>
