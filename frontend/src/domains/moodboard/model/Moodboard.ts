export interface Moodboard {
  id: string
  projectId: string
  imageUrls: string[]
  combinedUrl?: string
  characteristics?: string
  createdAt: string
  updatedAt: string
}

export interface CreateMoodboardDto {
  projectId: string
  imageUrls: string[]
  characteristics?: string
}

export interface UpdateMoodboardDto {
  imageUrls?: string[]
  combinedUrl?: string
  characteristics?: string
}
