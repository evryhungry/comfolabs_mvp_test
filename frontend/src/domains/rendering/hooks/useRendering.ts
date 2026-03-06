import { onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRenderingStore } from '../store/useRenderingStore'

export function useRendering(projectId: string) {
  const store = useRenderingStore()
  const { renderings, lastEnqueueResponse, pollingStatus, loading, executing, error } =
    storeToRefs(store)

  onMounted(() => {
    store.fetchRenderings(projectId)
  })

  onUnmounted(() => {
    store.stopPolling()
  })

  return {
    renderings,
    lastEnqueueResponse,
    pollingStatus,
    loading,
    executing,
    error,
    createRendering: store.createRendering,
    executeRendering: store.executeRendering,
  }
}
