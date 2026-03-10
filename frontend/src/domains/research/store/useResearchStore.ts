import { create } from 'zustand'
import type { Message } from '../model/Research'
import { researchApi } from '../service/researchApi'

interface ResearchState {
  messages: Message[]
  summary: string
  isSummarizing: boolean
  loading: boolean
  error: string | null
  sendMessage: (projectId: string, content: string) => Promise<void>
  summarize: (projectId: string) => Promise<void>
  reset: () => void
}

export const useResearchStore = create<ResearchState>((set, get) => ({
  messages: [],
  summary: '',
  isSummarizing: false,
  loading: false,
  error: null,

  async sendMessage(projectId: string, content: string) {
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content }
    set({ messages: [...get().messages, userMsg], loading: true })

    try {
      const response = await researchApi.sendMessage(projectId, content)
      const assistantMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: response }
      set({ messages: [...get().messages, assistantMsg], loading: false })
    } catch {
      set({ error: 'Failed to get response', loading: false })
    }
  },

  async summarize(projectId: string) {
    set({ isSummarizing: true })
    try {
      const assistantMessages = get()
        .messages.filter((m) => m.role === 'assistant')
        .map((m) => m.content)
      const summary = await researchApi.summarize(projectId, assistantMessages)
      set({ summary, isSummarizing: false })
    } catch {
      set({ error: 'Failed to summarize', isSummarizing: false })
    }
  },

  reset() {
    set({ messages: [], summary: '', isSummarizing: false, loading: false, error: null })
  },
}))
