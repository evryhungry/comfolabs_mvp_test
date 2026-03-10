import { create } from 'zustand'
import type { Moodboard, UpdateMoodboardDto } from '../model/Moodboard'
import { moodboardApi } from '../service/moodboardApi'
import { ApiError } from '../../../shared/api'

interface MoodboardState {
  moodboard: Moodboard | null
  loading: boolean
  error: string | null
  fetchMoodboard: (projectId: string) => Promise<void>
  uploadMoodboard: (projectId: string, files: File[]) => Promise<Moodboard>
  updateMoodboard: (id: string, dto: UpdateMoodboardDto) => Promise<Moodboard>
}

export const useMoodboardStore = create<MoodboardState>((set) => ({
  moodboard: null,
  loading: false,
  error: null,

  async fetchMoodboard(projectId: string) {
    set({ loading: true, error: null })
    try {
      const moodboard = await moodboardApi.getByProjectId(projectId)
      set({ moodboard, loading: false })
    } catch (e) {
      set({
        error: e instanceof ApiError ? `[${e.errorCode}] ${e.message}` : 'Failed to fetch moodboard',
        loading: false,
      })
    }
  },

  async uploadMoodboard(projectId: string, files: File[]) {
    const result = await moodboardApi.upload(projectId, files)
    set({ moodboard: result })
    return result
  },

  async updateMoodboard(id: string, dto: UpdateMoodboardDto) {
    const result = await moodboardApi.update(id, dto)
    set({ moodboard: result })
    return result
  },
}))
