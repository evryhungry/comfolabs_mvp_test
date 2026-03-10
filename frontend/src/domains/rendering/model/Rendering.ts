export const RenderingStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const

export type RenderingStatus = (typeof RenderingStatus)[keyof typeof RenderingStatus]

export const ViewType = {
  COMBINED: 'COMBINED',
  FRONT: 'FRONT',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  BACK: 'BACK',
  PERSPECTIVE: 'PERSPECTIVE',
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
} as const

export type ViewType = (typeof ViewType)[keyof typeof ViewType]

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
  userPrompt?: string
  sketchId?: string
  moodboardImageIndex?: number
  promptTemplateId?: string
}

export interface EnqueueRenderingResponse {
  renderingId: string
  status: string
  message: string
  queue: {
    position: number
    estimatedWaitSeconds: number
    totalInQueue: number
  }
}

export interface RenderingStatusResponse {
  id: string
  status: RenderingStatus
  resultUrl: string | null
  errorMessage: string | null
  createdAt: string
  updatedAt: string
}

export interface QueueStatusResponse {
  running: number
  waiting: number
  maxConcurrent: number
  maxQueueSize: number
  estimatedWaitForNewRequest: number
}
