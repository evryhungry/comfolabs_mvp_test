import api from '../../../shared/api'
import { API_ENDPOINTS } from '../../../shared/constants'
import type { Prompt, PromptTemplate, CreatePromptDto } from '../model/Prompt'

export const promptApi = {
  async getByProjectId(projectId: string): Promise<Prompt[]> {
    const { data } = await api.get<Prompt[]>(API_ENDPOINTS.PROMPTS, {
      params: { projectId },
    })
    return data
  },

  async getById(id: string): Promise<Prompt> {
    const { data } = await api.get<Prompt>(`${API_ENDPOINTS.PROMPTS}/${id}`)
    return data
  },

  async create(dto: CreatePromptDto): Promise<Prompt> {
    const { data } = await api.post<Prompt>(API_ENDPOINTS.PROMPTS, dto)
    return data
  },

  async getTemplates(): Promise<PromptTemplate[]> {
    const { data } = await api.get<PromptTemplate[]>(API_ENDPOINTS.PROMPT_TEMPLATES)
    return data
  },
}
