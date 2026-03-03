import api from '../../../shared/api'
import { API_ENDPOINTS } from '../../../shared/constants'
import type { User, CreateUserDto } from '../model/User'

export const userApi = {
  async getAll(): Promise<User[]> {
    const { data } = await api.get<User[]>(API_ENDPOINTS.USERS)
    return data
  },

  async getById(id: string): Promise<User> {
    const { data } = await api.get<User>(`${API_ENDPOINTS.USERS}/${id}`)
    return data
  },

  async create(dto: CreateUserDto): Promise<User> {
    const { data } = await api.post<User>(API_ENDPOINTS.USERS, dto)
    return data
  },

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.getAll()
    return users.find((u) => u.email === email) ?? null
  },
}
