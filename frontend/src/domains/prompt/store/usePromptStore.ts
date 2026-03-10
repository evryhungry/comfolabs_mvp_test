import { create } from 'zustand'
import type { PromptTemplate } from '../model/Prompt'
import { promptApi } from '../service/promptApi'
import { ApiError } from '../../../shared/api'

interface PromptState {
  templates: PromptTemplate[]
  loading: boolean
  error: string | null
  fetchPrompts: (projectId: string) => Promise<void>
  fetchTemplates: () => Promise<void>
}

export const usePromptStore = create<PromptState>((set) => ({
  templates: [],
  loading: false,
  error: null,

  async fetchPrompts(projectId: string) {
    set({ loading: true, error: null })
    try {
      await promptApi.getByProjectId(projectId)
      set({ loading: false })
    } catch (e) {
      set({
        error: e instanceof ApiError ? `[${e.errorCode}] ${e.message}` : 'Failed to fetch prompts',
        loading: false,
      })
    }
  },

  async fetchTemplates() {
    const templates = await promptApi.getTemplates()
    set({ templates })
  },
}))
