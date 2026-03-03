import api from '../../../shared/api'
import { API_ENDPOINTS } from '../../../shared/constants'
import type { Moodboard, CreateMoodboardDto, UpdateMoodboardDto } from '../model/Moodboard'

export const moodboardApi = {
  async getByProjectId(projectId: string): Promise<Moodboard | null> {
    const { data } = await api.get<Moodboard | null>(API_ENDPOINTS.MOODBOARDS, {
      params: { projectId },
    })
    return data
  },

  async create(dto: CreateMoodboardDto): Promise<Moodboard> {
    const { data } = await api.post<Moodboard>(API_ENDPOINTS.MOODBOARDS, dto)
    return data
  },

  async update(id: string, dto: UpdateMoodboardDto): Promise<Moodboard> {
    const { data } = await api.put<Moodboard>(`${API_ENDPOINTS.MOODBOARDS}/${id}`, dto)
    return data
  },

  async upload(projectId: string, files: File[], characteristics?: string): Promise<Moodboard> {
    const formData = new FormData()
    formData.append('projectId', projectId)
    files.forEach((file) => formData.append('files', file))
    if (characteristics) formData.append('characteristics', characteristics)
    const { data } = await api.post<Moodboard>(`${API_ENDPOINTS.MOODBOARDS}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${API_ENDPOINTS.MOODBOARDS}/${id}`)
  },
}
