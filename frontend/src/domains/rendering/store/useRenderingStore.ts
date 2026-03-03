import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Rendering, CreateRenderingDto, ExecuteRenderingRequest, RenderingResponseDto } from '../model/Rendering'
import { renderingApi } from '../service/renderingApi'

export const useRenderingStore = defineStore('rendering', () => {
  const renderings = ref<Rendering[]>([])
  const lastResponse = ref<RenderingResponseDto | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRenderings(projectId: string) {
    loading.value = true
    error.value = null
    try {
      renderings.value = await renderingApi.getByProjectId(projectId)
    } catch (e) {
      error.value = 'Failed to fetch renderings'
    } finally {
      loading.value = false
    }
  }

  async function createRendering(dto: CreateRenderingDto) {
    const rendering = await renderingApi.create(dto)
    renderings.value.unshift(rendering)
    return rendering
  }

  async function executeRendering(request: ExecuteRenderingRequest) {
    const result = await renderingApi.execute(request)
    lastResponse.value = result
    // Refresh renderings list to pick up new record
    await fetchRenderings(request.projectId)
    return result
  }

  return { renderings, lastResponse, loading, error, fetchRenderings, createRendering, executeRendering }
})
