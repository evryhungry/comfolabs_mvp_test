import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePromptStore } from '../store/usePromptStore'

export function usePrompt(projectId: string) {
  const store = usePromptStore()
  const { prompts, templates, loading, error } = storeToRefs(store)

  onMounted(() => {
    store.fetchPrompts(projectId)
    store.fetchTemplates()
  })

  return {
    prompts,
    templates,
    loading,
    error,
    createPrompt: store.createPrompt,
  }
}
