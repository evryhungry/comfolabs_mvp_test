import api from '../../../shared/api'
import { API_ENDPOINTS } from '../../../shared/constants'
import type { Sketch, CreateSketchDto } from '../model/Sketch'

export const sketchApi = {
  async getByProjectId(projectId: string): Promise<Sketch[]> {
    const { data } = await api.get<Sketch[]>(API_ENDPOINTS.SKETCHES, {
      params: { projectId },
    })
    return data
  },

  async create(dto: CreateSketchDto): Promise<Sketch> {
    const { data } = await api.post<Sketch>(API_ENDPOINTS.SKETCHES, dto)
    return data
  },

  async upload(projectId: string, file: File): Promise<Sketch> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('projectId', projectId)
    const { data } = await api.post<Sketch>(`${API_ENDPOINTS.SKETCHES}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${API_ENDPOINTS.SKETCHES}/${id}`)
  },
}
