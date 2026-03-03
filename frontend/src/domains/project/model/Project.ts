export interface Project {
  id: string
  userId: string
  title: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateProjectDto {
  userId: string
  title: string
  description?: string
}

export interface UpdateProjectDto {
  title?: string
  description?: string
}
