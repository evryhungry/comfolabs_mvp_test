import api from '../../../shared/api'
import { API_ENDPOINTS } from '../../../shared/constants'
import type {
  Rendering,
  CreateRenderingDto,
  ExecuteRenderingRequest,
  EnqueueRenderingResponse,
  RenderingStatusResponse,
  QueueStatusResponse,
} from '../model/Rendering'

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

  async execute(request: ExecuteRenderingRequest): Promise<EnqueueRenderingResponse> {
    const { data } = await api.post<EnqueueRenderingResponse>(
      `${API_ENDPOINTS.RENDERINGS}/execute`,
      request,
    )
    return data
  },

  async getStatus(renderingId: string): Promise<RenderingStatusResponse> {
    const { data } = await api.get<RenderingStatusResponse>(
      `${API_ENDPOINTS.RENDERINGS}/${renderingId}/status`,
    )
    return data
  },

  async getQueueStatus(): Promise<QueueStatusResponse> {
    const { data } = await api.get<QueueStatusResponse>(
      `${API_ENDPOINTS.RENDERINGS}/queue/status`,
    )
    return data
  },
}
