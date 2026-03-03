export enum RenderingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum ViewType {
  COMBINED = 'COMBINED',
  FRONT = 'FRONT',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  BACK = 'BACK',
  PERSPECTIVE = 'PERSPECTIVE',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
}

export interface Rendering {
  id: string
  projectId: string
  promptId: string
  resultUrl?: string
  status: RenderingStatus
  viewType: ViewType
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

export interface CreateRenderingDto {
  projectId: string
  promptId: string
}

export interface ExecuteRenderingRequest {
  projectId: string
  userPrompt: string
  sketchId?: string
  moodboardImageIndex?: number
  promptTemplateId?: string
}

export interface RenderingResponseDto {
  projectId: string
  renderedImage: string | null
  views: string[]
  promptUsed: string
  metadata: {
    model: string
    promptTokens: number
    completionTokens: number
    totalTokens: number
    createdAt: string
  }
}
