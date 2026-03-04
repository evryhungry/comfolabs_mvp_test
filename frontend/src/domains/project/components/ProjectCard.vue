<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectDetail } from '../hooks/useProject'
import { useSketch } from '../../sketch/hooks/useSketch'
import { useMoodboard } from '../../moodboard/hooks/useMoodboard'
import { usePrompt } from '../../prompt/hooks/usePrompt'
import { useRendering } from '../../rendering/hooks/useRendering'
import SketchUploader from '../../sketch/components/SketchUploader.vue'
import MoodboardEditor from '../../moodboard/components/MoodboardEditor.vue'
import PromptEditor from '../../prompt/components/PromptEditor.vue'
import RenderingResult from '../../rendering/components/RenderingResult.vue'
import BaseButton from '../../../components/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const projectId = route.params.id as string

const { currentProject, loading, error } = useProjectDetail(projectId)
const { sketches, uploadSketch, removeSketch } = useSketch(projectId)
const { moodboard, uploadMoodboard } = useMoodboard(projectId)
const { templates } = usePrompt(projectId)
const { renderings, executeRendering } = useRendering(projectId)

const activeTab = ref<'design' | 'render'>('design')
const executing = ref(false)
const selectedSketchId = ref<string | null>(null)
const selectedMoodboardIndex = ref<number | null>(null)

const latestRendering = computed(() => renderings.value[0] ?? null)

async function handleSketchUpload(file: File) {
  try {
    await uploadSketch(projectId, file)
  } catch {
    // handled by store
  }
}

async function handleSketchRemove(id: string) {
  try {
    if (selectedSketchId.value === id) {
      selectedSketchId.value = null
    }
    await removeSketch(id)
  } catch {
    // handled by store
  }
}

async function handleMoodboardUpload(files: File[]) {
  try {
    await uploadMoodboard(projectId, files)
  } catch {
    // handled by store
  }
}

function selectSketch(id: string) {
  selectedSketchId.value = selectedSketchId.value === id ? null : id
}

function selectMoodboardImage(index: number) {
  selectedMoodboardIndex.value = selectedMoodboardIndex.value === index ? null : index
}

async function handleExecuteRendering(payload: { templateId?: string; userInput: string }) {
  executing.value = true
  try {
    await executeRendering({
      projectId,
      userPrompt: payload.userInput || undefined,
      sketchId: selectedSketchId.value ?? undefined,
      moodboardImageIndex: selectedMoodboardIndex.value ?? undefined,
      promptTemplateId: payload.templateId,
    })
  } catch {
    // handled by store
  } finally {
    executing.value = false
  }
}
</script>

<template>
  <div class="project-detail">
    <!-- Back Button -->
    <button class="back-btn" @click="router.push('/')">
      <span class="back-arrow">&larr;</span>
      Back to Projects
    </button>

    <!-- Loading -->
    <div v-if="loading" class="detail-loading">
      <div class="loading-spinner"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="detail-error">
      <p>{{ error }}</p>
      <BaseButton label="Go Back" variant="secondary" @click="router.push('/')" />
    </div>

    <!-- Content -->
    <template v-else-if="currentProject">
      <!-- Project Header -->
      <div class="detail-header">
        <div class="header-info">
          <h1>{{ currentProject.title }}</h1>
          <p v-if="currentProject.description" class="header-desc">{{ currentProject.description }}</p>
        </div>
        <div class="header-stats">
          <div class="stat">
            <span class="stat-value">{{ sketches.length }}</span>
            <span class="stat-label">Sketches</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ moodboard ? moodboard.imageUrls.length : 0 }}</span>
            <span class="stat-label">Mood Refs</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ renderings.length }}</span>
            <span class="stat-label">Renders</span>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="tab-bar">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'design' }"
          @click="activeTab = 'design'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
            <path d="M2 2l7.586 7.586"/>
          </svg>
          Design Assets
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'render' }"
          @click="activeTab = 'render'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 3v18m-7-4l7 4 7-4M5 8l7-5 7 5"/>
          </svg>
          Rendering
        </button>
      </div>

      <!-- Design Tab -->
      <div v-show="activeTab === 'design'" class="tab-content">
        <div class="design-grid">
          <section class="panel">
            <SketchUploader
              :sketches="sketches"
              @upload="handleSketchUpload"
              @remove="handleSketchRemove"
            />
          </section>
          <section class="panel">
            <MoodboardEditor :moodboard="moodboard" @upload="handleMoodboardUpload" />
          </section>
        </div>
      </div>

      <!-- Rendering Tab -->
      <div v-show="activeTab === 'render'" class="tab-content">
        <div class="render-layout">
          <section class="panel prompt-panel">
            <!-- Sketch Selection -->
            <div v-if="sketches.length > 0" class="sketch-selector">
              <h4 class="selector-title">Select Sketch</h4>
              <div class="sketch-grid">
                <button
                  v-for="sketch in sketches"
                  :key="sketch.id"
                  class="sketch-thumb-btn"
                  :class="{ selected: selectedSketchId === sketch.id }"
                  @click="selectSketch(sketch.id)"
                >
                  <img :src="sketch.imageUrl" :alt="sketch.filename" />
                  <div v-if="selectedSketchId === sketch.id" class="check-overlay">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </button>
              </div>
              <p v-if="!selectedSketchId" class="selector-hint">No sketch selected (first sketch will be used)</p>
              <p v-else class="selector-hint selector-hint--active">
                {{ sketches.find(s => s.id === selectedSketchId)?.filename }}
              </p>
            </div>
            <div v-else class="sketch-selector-empty">
              <p>No sketches uploaded. Go to Design Assets tab to upload sketches.</p>
            </div>

            <!-- Moodboard Selection -->
            <div v-if="moodboard && moodboard.imageUrls.length > 0" class="moodboard-selector">
              <h4 class="selector-title">Select Mood Reference</h4>
              <div class="sketch-grid">
                <button
                  v-for="(url, idx) in moodboard.imageUrls"
                  :key="idx"
                  class="sketch-thumb-btn"
                  :class="{ selected: selectedMoodboardIndex === idx }"
                  @click="selectMoodboardImage(idx)"
                >
                  <img :src="url" alt="moodboard reference" />
                  <div v-if="selectedMoodboardIndex === idx" class="check-overlay">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </button>
              </div>
              <p v-if="selectedMoodboardIndex === null" class="selector-hint">No image selected (first image will be used)</p>
              <p v-else class="selector-hint selector-hint--active">
                Mood reference #{{ selectedMoodboardIndex + 1 }}
              </p>
            </div>
            <div v-else class="sketch-selector-empty">
              <p>No moodboard uploaded. Go to Design Assets tab to upload references.</p>
            </div>

            <PromptEditor :templates="templates" @submit="handleExecuteRendering" />
            <div v-if="executing" class="execute-status">
              <div class="loading-spinner small"></div>
              <span>Generating rendering...</span>
            </div>
          </section>
          <section class="panel result-panel">
            <h3 class="panel-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
              </svg>
              Results
            </h3>
            <div v-if="renderings.length === 0" class="empty-results">
              <p>No renderings yet. Configure your prompt and click "Generate" to start.</p>
            </div>
            <div v-else class="results-list">
              <RenderingResult
                v-for="r in renderings"
                :key="r.id"
                :rendering="r"
              />
            </div>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.project-detail {
  max-width: 1120px;
  margin: 0 auto;
}

/* Back */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 24px;
  padding: 4px 0;
  transition: color var(--transition);
}

.back-btn:hover {
  color: var(--color-primary);
}

.back-arrow {
  font-size: 1.125rem;
  transition: transform var(--transition);
}

.back-btn:hover .back-arrow {
  transform: translateX(-3px);
}

/* Loading / Error */
.detail-loading {
  display: flex;
  justify-content: center;
  padding: 100px 0;
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-spinner.small {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.detail-error {
  text-align: center;
  padding: 80px 0;
  color: var(--color-danger);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* Header */
.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.header-info h1 {
  margin-bottom: 4px;
}

.header-desc {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}

.header-stats {
  display: flex;
  gap: 20px;
  flex-shrink: 0;
}

.stat {
  text-align: center;
  padding: 12px 18px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  min-width: 80px;
}

.stat-value {
  display: block;
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

.stat-label {
  display: block;
  font-size: 0.6875rem;
  color: var(--color-text-muted);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 500;
}

/* Tabs */
.tab-bar {
  display: flex;
  gap: 4px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 4px;
  margin-bottom: 24px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: all var(--transition);
}

.tab-btn:hover {
  color: var(--color-text);
  background: var(--color-bg);
}

.tab-btn.active {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
}

/* Panels */
.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: var(--color-text);
}

/* Design Tab */
.design-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .design-grid {
    grid-template-columns: 1fr;
  }
}

/* Render Tab */
.render-layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 20px;
  align-items: start;
}

@media (max-width: 900px) {
  .render-layout {
    grid-template-columns: 1fr;
  }
}

.prompt-panel {
  position: sticky;
  top: 92px;
}

/* Sketch & Moodboard Selector */
.sketch-selector,
.moodboard-selector {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border-light);
}

.selector-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 10px;
}

.sketch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  gap: 8px;
}

.sketch-thumb-btn {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  background: var(--color-bg);
  transition: all var(--transition);
}

.sketch-thumb-btn:hover {
  border-color: var(--color-primary-subtle);
}

.sketch-thumb-btn.selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.sketch-thumb-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.check-overlay {
  position: absolute;
  inset: 0;
  background: rgba(99, 102, 241, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.selector-hint {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
  margin-top: 8px;
}

.selector-hint--active {
  color: var(--color-primary);
  font-weight: 500;
}

.sketch-selector-empty {
  margin-bottom: 20px;
  padding: 16px;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.execute-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  margin-top: 16px;
  background: var(--color-primary-light);
  border-radius: var(--radius-md);
  font-size: 0.8125rem;
  color: var(--color-primary);
  font-weight: 500;
}

.empty-results {
  text-align: center;
  padding: 48px 24px;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
