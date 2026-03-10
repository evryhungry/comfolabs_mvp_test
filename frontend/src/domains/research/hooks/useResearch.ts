import { useEffect } from 'react'
import { useResearchStore } from '../store/useResearchStore'

export function useResearch(projectId: string) {
  const messages = useResearchStore((s) => s.messages)
  const summary = useResearchStore((s) => s.summary)
  const isSummarizing = useResearchStore((s) => s.isSummarizing)
  const loading = useResearchStore((s) => s.loading)
  const error = useResearchStore((s) => s.error)
  const sendMessage = useResearchStore((s) => s.sendMessage)
  const summarize = useResearchStore((s) => s.summarize)
  const reset = useResearchStore((s) => s.reset)

  useEffect(() => {
    return () => reset()
  }, [projectId, reset])

  return { messages, summary, isSummarizing, loading, error, sendMessage, summarize }
}
