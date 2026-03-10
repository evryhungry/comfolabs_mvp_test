export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface ResearchSummary {
  content: string
  createdAt: string
}
