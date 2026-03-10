import { create } from 'zustand'
import type { Sketch } from '../model/Sketch'
import { sketchApi } from '../service/sketchApi'
import { ApiError } from '../../../shared/api'

interface SketchState {
  sketches: Sketch[]
  loading: boolean
  error: string | null
  fetchSketches: (projectId: string) => Promise<void>
  uploadSketch: (projectId: string, file: File) => Promise<Sketch>
  removeSketch: (id: string) => Promise<void>
}

export const useSketchStore = create<SketchState>((set, get) => ({
  sketches: [],
  loading: false,
  error: null,

  async fetchSketches(projectId: string) {
    set({ loading: true, error: null })
    try {
      const sketches = await sketchApi.getByProjectId(projectId)
      set({ sketches, loading: false })
    } catch (e) {
      set({
        error: e instanceof ApiError ? `[${e.errorCode}] ${e.message}` : 'Failed to fetch sketches',
        loading: false,
      })
    }
  },

  async uploadSketch(projectId: string, file: File) {
    const sketch = await sketchApi.upload(projectId, file)
    set({ sketches: [...get().sketches, sketch] })
    return sketch
  },

  async removeSketch(id: string) {
    await sketchApi.delete(id)
    set({ sketches: get().sketches.filter((s) => s.id !== id) })
  },
}))
