<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectList } from '../hooks/useProject'
import { useUser } from '../../user/hooks/useUser'
import BaseButton from '../../../components/BaseButton.vue'
import BaseInput from '../../../components/BaseInput.vue'

const router = useRouter()
const { currentUser } = useUser()
const { projects, loading, error, createProject } = useProjectList(currentUser.value?.id)

const showCreateModal = ref(false)
const newTitle = ref('')
const newDescription = ref('')
const creating = ref(false)

async function handleCreate() {
  if (!newTitle.value.trim() || !currentUser.value) return
  creating.value = true
  try {
    const project = await createProject({
      userId: currentUser.value.id,
      title: newTitle.value.trim(),
      description: newDescription.value.trim() || undefined,
    })
    showCreateModal.value = false
    newTitle.value = ''
    newDescription.value = ''
    router.push(`/project/${project.id}`)
  } catch {
    // handled by store
  } finally {
    creating.value = false
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="project-list-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1>My Projects</h1>
        <p class="page-subtitle">Manage your industrial design rendering projects</p>
      </div>
      <BaseButton label="+ New Project" @click="showCreateModal = true" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading projects...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">!</div>
      <p>{{ error }}</p>
    </div>

    <!-- Empty -->
    <div v-else-if="projects.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      </div>
      <h3>No projects yet</h3>
      <p>Create your first rendering project to get started</p>
      <BaseButton label="Create Project" @click="showCreateModal = true" />
    </div>

    <!-- Projects Grid -->
    <div v-else class="project-grid">
      <router-link
        v-for="project in projects"
        :key="project.id"
        :to="`/project/${project.id}`"
        class="project-card"
      >
        <div class="card-color-bar"></div>
        <div class="card-body">
          <h3 class="card-title">{{ project.title }}</h3>
          <p v-if="project.description" class="card-desc">{{ project.description }}</p>
          <p v-else class="card-desc card-desc--empty">No description</p>
        </div>
        <div class="card-footer">
          <span class="card-date">{{ formatDate(project.createdAt) }}</span>
          <span class="card-arrow">&rarr;</span>
        </div>
      </router-link>
    </div>

    <!-- Create Modal -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
        <div class="modal">
          <div class="modal-header">
            <h2>New Project</h2>
            <button class="modal-close" @click="showCreateModal = false">&times;</button>
          </div>
          <div class="modal-body">
            <BaseInput
              v-model="newTitle"
              label="Project Title"
              placeholder="e.g. Smart Speaker Concept"
            />
            <div class="textarea-group">
              <label class="textarea-label">Description (optional)</label>
              <textarea
                v-model="newDescription"
                class="textarea-field"
                placeholder="Brief description of your project..."
                rows="3"
              />
            </div>
          </div>
          <div class="modal-footer">
            <BaseButton label="Cancel" variant="secondary" @click="showCreateModal = false" />
            <BaseButton
              label="Create Project"
              :loading="creating"
              :disabled="!newTitle.trim()"
              @click="handleCreate"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.project-list-page {
  max-width: 960px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;
}

.page-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  margin-top: 4px;
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px 0;
  color: var(--color-text-muted);
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 80px 0;
  color: var(--color-danger);
}

.error-icon {
  width: 48px;
  height: 48px;
  background: var(--color-danger-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
}

/* Empty */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 80px 0;
  text-align: center;
}

.empty-icon {
  color: var(--color-text-muted);
  margin-bottom: 8px;
}

.empty-state h3 {
  color: var(--color-text);
}

.empty-state p {
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

/* Grid */
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* Card */
.project-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all var(--transition);
  text-decoration: none;
  color: inherit;
}

.project-card:hover {
  border-color: var(--color-primary-subtle);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-color-bar {
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary), #a78bfa);
}

.card-body {
  padding: 20px 20px 12px;
  flex: 1;
}

.card-title {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 6px;
}

.card-desc {
  font-size: 0.8375rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-desc--empty {
  color: var(--color-text-muted);
  font-style: italic;
}

.card-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-date {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.card-arrow {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  transition: all var(--transition);
}

.project-card:hover .card-arrow {
  color: var(--color-primary);
  transform: translateX(3px);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 480px;
  box-shadow: var(--shadow-xl);
  animation: slideUp 0.2s ease;
}

@keyframes slideUp {
  from { transform: translateY(12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 1.5rem;
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
}

.modal-close:hover {
  background: var(--color-bg);
  color: var(--color-text);
}

.modal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.textarea-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.textarea-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.textarea-field {
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--color-text);
  background: var(--color-surface);
  resize: vertical;
  outline: none;
  transition: all var(--transition);
}

.textarea-field::placeholder {
  color: var(--color-text-muted);
}

.textarea-field:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.modal-footer {
  padding: 16px 24px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
