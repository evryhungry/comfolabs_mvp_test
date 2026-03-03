export interface Sketch {
  id: string
  projectId: string
  imageUrl: string
  filename: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface CreateSketchDto {
  projectId: string
  imageUrl: string
  filename: string
  sortOrder?: number
}
