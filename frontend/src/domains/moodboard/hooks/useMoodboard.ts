import { useEffect } from 'react'
import { useMoodboardStore } from '../store/useMoodboardStore'

export function useMoodboard(projectId: string) {
  const moodboard = useMoodboardStore((s) => s.moodboard)
  const loading = useMoodboardStore((s) => s.loading)
  const error = useMoodboardStore((s) => s.error)
  const fetchMoodboard = useMoodboardStore((s) => s.fetchMoodboard)
  const uploadMoodboard = useMoodboardStore((s) => s.uploadMoodboard)
  const updateMoodboard = useMoodboardStore((s) => s.updateMoodboard)

  useEffect(() => {
    fetchMoodboard(projectId)
  }, [projectId, fetchMoodboard])

  return { moodboard, loading, error, uploadMoodboard, updateMoodboard }
}
