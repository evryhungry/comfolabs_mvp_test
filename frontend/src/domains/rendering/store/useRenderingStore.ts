import { create } from 'zustand'
import type {
  Rendering,
  ExecuteRenderingRequest,
  EnqueueRenderingResponse,
  RenderingStatusResponse,
} from '../model/Rendering'
import { RenderingStatus } from '../model/Rendering'
import { renderingApi } from '../service/renderingApi'
import { ApiError } from '../../../shared/api'

const POLL_INTERVAL_MS = 3000
const MAX_POLL_ATTEMPTS = 200

interface RenderingState {
  renderings: Rendering[]
  lastEnqueueResponse: EnqueueRenderingResponse | null
  pollingStatus: RenderingStatusResponse | null
  loading: boolean
  executing: boolean
  error: string | null
  _pollTimer: ReturnType<typeof setTimeout> | null
  fetchRenderings: (projectId: string) => Promise<void>
  executeRendering: (request: ExecuteRenderingRequest) => Promise<EnqueueRenderingResponse | undefined>
  stopPolling: () => void
}

export const useRenderingStore = create<RenderingState>((set, get) => ({
  renderings: [],
  lastEnqueueResponse: null,
  pollingStatus: null,
  loading: false,
  executing: false,
  error: null,
  _pollTimer: null,

  async fetchRenderings(projectId: string) {
    set({ loading: true, error: null })
    try {
      const renderings = await renderingApi.getByProjectId(projectId)
      set({ renderings, loading: false })
    } catch {
      set({ error: 'Failed to fetch renderings', loading: false })
    }
  },

  async executeRendering(request: ExecuteRenderingRequest) {
    set({ executing: true, error: null, pollingStatus: null })

    try {
      const enqueueResult = await renderingApi.execute(request)
      set({ lastEnqueueResponse: enqueueResult })

      // Refresh list
      const renderings = await renderingApi.getByProjectId(request.projectId)
      set({ renderings })

      // Poll until done
      const { stopPolling } = get()
      stopPolling()

      for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
        await new Promise<void>((resolve) => {
          const timer = setTimeout(resolve, POLL_INTERVAL_MS)
          set({ _pollTimer: timer })
        })

        try {
          const status = await renderingApi.getStatus(enqueueResult.renderingId)
          set({ pollingStatus: status })

          // Update in list
          const currentRenderings = get().renderings
          const idx = currentRenderings.findIndex((r) => r.id === enqueueResult.renderingId)
          if (idx !== -1) {
            const updated = [...currentRenderings]
            updated[idx] = {
              ...updated[idx]!,
              status: status.status,
              resultUrl: status.resultUrl ?? undefined,
              errorMessage: status.errorMessage ?? undefined,
              updatedAt: status.updatedAt,
            }
            set({ renderings: updated })
          }

          if (status.status === RenderingStatus.COMPLETED || status.status === RenderingStatus.FAILED) {
            const final = await renderingApi.getByProjectId(request.projectId)
            set({ renderings: final, executing: false })
            return enqueueResult
          }
        } catch {
          // continue polling
        }
      }

      set({ error: 'Rendering timed out. Check the results later.', executing: false })
      return enqueueResult
    } catch (e) {
      if (e instanceof ApiError) {
        set({ error: `[${e.errorCode}] ${e.message}`, executing: false })
      } else {
        set({ error: e instanceof Error ? e.message : 'Failed to execute rendering', executing: false })
      }
      throw e
    }
  },

  stopPolling() {
    const timer = get()._pollTimer
    if (timer) {
      clearTimeout(timer)
      set({ _pollTimer: null })
    }
  },
}))
