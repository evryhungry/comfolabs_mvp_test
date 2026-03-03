import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRenderingStore } from '../store/useRenderingStore'

export function useRendering(projectId: string) {
  const store = useRenderingStore()
  const { renderings, lastResponse, loading, error } = storeToRefs(store)

  onMounted(() => {
    store.fetchRenderings(projectId)
  })

  return {
    renderings,
    lastResponse,
    loading,
    error,
    createRendering: store.createRendering,
    executeRendering: store.executeRendering,
  }
}
