export interface Prompt {
  id: string
  projectId: string
  templateId?: string
  userInput: string
  finalPrompt: string
  createdAt: string
  updatedAt: string
}

export interface PromptTemplate {
  id: string
  name: string
  content: string
  version: number
  isActive: boolean
}

export interface CreatePromptDto {
  projectId: string
  templateId?: string
  userInput: string
}
