import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Moodboard, CreateMoodboardDto, UpdateMoodboardDto } from '../model/Moodboard'
import { moodboardApi } from '../service/moodboardApi'
import { ApiError } from '../../../shared/api'

export const useMoodboardStore = defineStore('moodboard', () => {
  const moodboard = ref<Moodboard | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchMoodboard(projectId: string) {
    loading.value = true
    error.value = null
    try {
      moodboard.value = await moodboardApi.getByProjectId(projectId)
    } catch (e) {
      error.value = e instanceof ApiError ? `[${e.errorCode}] ${e.message}` : 'Failed to fetch moodboard'
    } finally {
      loading.value = false
    }
  }

  async function createMoodboard(dto: CreateMoodboardDto) {
    const result = await moodboardApi.create(dto)
    moodboard.value = result
    return result
  }

  async function uploadMoodboard(projectId: string, files: File[]) {
    const result = await moodboardApi.upload(projectId, files)
    moodboard.value = result
    return result
  }

  async function updateMoodboard(id: string, dto: UpdateMoodboardDto) {
    const result = await moodboardApi.update(id, dto)
    moodboard.value = result
    return result
  }

  return { moodboard, loading, error, fetchMoodboard, createMoodboard, uploadMoodboard, updateMoodboard }
})
