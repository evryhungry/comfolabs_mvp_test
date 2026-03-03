import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMoodboardStore } from '../store/useMoodboardStore'

export function useMoodboard(projectId: string) {
  const store = useMoodboardStore()
  const { moodboard, loading, error } = storeToRefs(store)

  onMounted(() => {
    store.fetchMoodboard(projectId)
  })

  return {
    moodboard,
    loading,
    error,
    createMoodboard: store.createMoodboard,
    uploadMoodboard: store.uploadMoodboard,
    updateMoodboard: store.updateMoodboard,
  }
}
