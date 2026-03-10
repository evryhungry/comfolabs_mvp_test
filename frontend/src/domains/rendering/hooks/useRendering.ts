import { useEffect } from 'react'
import { useRenderingStore } from '../store/useRenderingStore'

export function useRendering(projectId: string) {
  const renderings = useRenderingStore((s) => s.renderings)
  const executing = useRenderingStore((s) => s.executing)
  const error = useRenderingStore((s) => s.error)
  const fetchRenderings = useRenderingStore((s) => s.fetchRenderings)
  const executeRendering = useRenderingStore((s) => s.executeRendering)
  const stopPolling = useRenderingStore((s) => s.stopPolling)

  useEffect(() => {
    fetchRenderings(projectId)
    return () => stopPolling()
  }, [projectId, fetchRenderings, stopPolling])

  return { renderings, executing, error, executeRendering }
}
