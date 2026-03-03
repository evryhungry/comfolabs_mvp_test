import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSketchStore } from '../store/useSketchStore'

export function useSketch(projectId: string) {
  const store = useSketchStore()
  const { sketches, loading, error } = storeToRefs(store)

  onMounted(() => {
    store.fetchSketches(projectId)
  })

  return {
    sketches,
    loading,
    error,
    addSketch: store.addSketch,
    uploadSketch: store.uploadSketch,
    removeSketch: store.removeSketch,
  }
}
