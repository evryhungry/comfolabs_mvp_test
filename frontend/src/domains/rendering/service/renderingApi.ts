import api from '../../../shared/api'
import { API_ENDPOINTS } from '../../../shared/constants'
import type { Rendering, CreateRenderingDto, ExecuteRenderingRequest, RenderingResponseDto } from '../model/Rendering'

export const renderingApi = {
  async getByProjectId(projectId: string): Promise<Rendering[]> {
    const { data } = await api.get<Rendering[]>(API_ENDPOINTS.RENDERINGS, {
      params: { projectId },
    })
    return data
  },

  async getById(id: string): Promise<Rendering> {
    const { data } = await api.get<Rendering>(`${API_ENDPOINTS.RENDERINGS}/${id}`)
    return data
  },

  async create(dto: CreateRenderingDto): Promise<Rendering> {
    const { data } = await api.post<Rendering>(API_ENDPOINTS.RENDERINGS, dto)
    return data
  },

  async execute(request: ExecuteRenderingRequest): Promise<RenderingResponseDto> {
    const { data } = await api.post<RenderingResponseDto>(
      `${API_ENDPOINTS.RENDERINGS}/execute`,
      request,
    )
    return data
  },
}
