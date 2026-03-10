import { useEffect } from 'react'
import { usePromptStore } from '../store/usePromptStore'

export function usePrompt(projectId: string) {
  const templates = usePromptStore((s) => s.templates)
  const loading = usePromptStore((s) => s.loading)
  const error = usePromptStore((s) => s.error)
  const fetchPrompts = usePromptStore((s) => s.fetchPrompts)
  const fetchTemplates = usePromptStore((s) => s.fetchTemplates)

  useEffect(() => {
    fetchPrompts(projectId)
    fetchTemplates()
  }, [projectId, fetchPrompts, fetchTemplates])

  return { templates, loading, error }
}
