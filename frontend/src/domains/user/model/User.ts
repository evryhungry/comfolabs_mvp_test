export interface User {
  id: string
  email: string
  name: string
  provider?: string
  googleId?: string
  profileImage?: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserDto {
  email: string
  name: string
}
