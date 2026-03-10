import { useEffect } from 'react'
import { useSketchStore } from '../store/useSketchStore'

export function useSketch(projectId: string) {
  const sketches = useSketchStore((s) => s.sketches)
  const loading = useSketchStore((s) => s.loading)
  const error = useSketchStore((s) => s.error)
  const fetchSketches = useSketchStore((s) => s.fetchSketches)
  const uploadSketch = useSketchStore((s) => s.uploadSketch)
  const removeSketch = useSketchStore((s) => s.removeSketch)

  useEffect(() => {
    fetchSketches(projectId)
  }, [projectId, fetchSketches])

  return { sketches, loading, error, uploadSketch, removeSketch }
}
