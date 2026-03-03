import api from '../../../shared/api'
import { API_ENDPOINTS } from '../../../shared/constants'
import type { Project, CreateProjectDto, UpdateProjectDto } from '../model/Project'

export const projectApi = {
  async getAll(): Promise<Project[]> {
    const { data } = await api.get<Project[]>(API_ENDPOINTS.PROJECTS)
    return data
  },

  async getByUserId(userId: string): Promise<Project[]> {
    const { data } = await api.get<Project[]>(API_ENDPOINTS.PROJECTS, {
      params: { userId },
    })
    return data
  },

  async getById(id: string): Promise<Project> {
    const { data } = await api.get<Project>(`${API_ENDPOINTS.PROJECTS}/${id}`)
    return data
  },

  async create(dto: CreateProjectDto): Promise<Project> {
    const { data } = await api.post<Project>(API_ENDPOINTS.PROJECTS, dto)
    return data
  },

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const { data } = await api.put<Project>(`${API_ENDPOINTS.PROJECTS}/${id}`, dto)
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${API_ENDPOINTS.PROJECTS}/${id}`)
  },
}
