import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  Rendering,
  CreateRenderingDto,
  ExecuteRenderingRequest,
  EnqueueRenderingResponse,
  RenderingStatusResponse,
} from '../model/Rendering'
import { RenderingStatus } from '../model/Rendering'
import { renderingApi } from '../service/renderingApi'

const POLL_INTERVAL_MS = 3000
const MAX_POLL_ATTEMPTS = 200 // ~10 min max

export const useRenderingStore = defineStore('rendering', () => {
  const renderings = ref<Rendering[]>([])
  const lastEnqueueResponse = ref<EnqueueRenderingResponse | null>(null)
  const pollingStatus = ref<RenderingStatusResponse | null>(null)
  const loading = ref(false)
  const executing = ref(false)
  const error = ref<string | null>(null)
  let pollTimer: ReturnType<typeof setTimeout> | null = null

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
    executing.value = true
    error.value = null
    pollingStatus.value = null

    try {
      const enqueueResult = await renderingApi.execute(request)
      lastEnqueueResponse.value = enqueueResult

      // Refresh list to show new PENDING rendering
      await fetchRenderings(request.projectId)

      // Start polling for completion
      await pollUntilDone(enqueueResult.renderingId, request.projectId)

      return enqueueResult
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to execute rendering'
      throw e
    } finally {
      executing.value = false
    }
  }

  async function pollUntilDone(renderingId: string, projectId: string): Promise<void> {
    stopPolling()

    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      await sleep(POLL_INTERVAL_MS)

      try {
        const status = await renderingApi.getStatus(renderingId)
        pollingStatus.value = status

        // Update the rendering in the local list
        updateRenderingInList(renderingId, status)

        if (status.status === RenderingStatus.COMPLETED || status.status === RenderingStatus.FAILED) {
          // Final refresh to get full entity
          await fetchRenderings(projectId)
          return
        }
      } catch {
        // Polling error — continue trying
      }
    }

    error.value = 'Rendering timed out. Check the results later.'
  }

  function updateRenderingInList(renderingId: string, status: RenderingStatusResponse) {
    const idx = renderings.value.findIndex((r) => r.id === renderingId)
    if (idx !== -1) {
      renderings.value[idx] = {
        ...renderings.value[idx],
        status: status.status,
        resultUrl: status.resultUrl ?? undefined,
        errorMessage: status.errorMessage ?? undefined,
        updatedAt: status.updatedAt,
      }
    }
  }

  function stopPolling() {
    if (pollTimer) {
      clearTimeout(pollTimer)
      pollTimer = null
    }
  }

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      pollTimer = setTimeout(resolve, ms)
    })
  }

  return {
    renderings,
    lastEnqueueResponse,
    pollingStatus,
    loading,
    executing,
    error,
    fetchRenderings,
    createRendering,
    executeRendering,
    stopPolling,
  }
})
