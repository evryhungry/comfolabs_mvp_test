import { create } from 'zustand'
import type { User, CreateUserDto } from '../model/User'
import { userApi } from '../service/userApi'
import { ApiError } from '../../../shared/api'

const STORAGE_KEY = 'comfolabs_user'

function loadFromStorage(): User | null {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
  return null
}

interface UserState {
  currentUser: User | null
  loading: boolean
  error: string | null
  createUser: (dto: CreateUserDto) => Promise<User>
  signIn: (email: string) => Promise<User | null>
  setUser: (user: User) => void
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: loadFromStorage(),
  loading: false,
  error: null,

  async createUser(dto: CreateUserDto) {
    set({ loading: true, error: null })
    try {
      const user = await userApi.create(dto)
      set({ currentUser: user, loading: false })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
    } catch (e) {
      set({
        error: e instanceof ApiError ? `[${e.errorCode}] ${e.message}` : 'Failed to create user',
        loading: false,
      })
      throw e
    }
  },

  async signIn(email: string) {
    set({ loading: true, error: null })
    try {
      const user = await userApi.findByEmail(email)
      if (!user) {
        set({ error: 'No account found with this email', loading: false })
        return null
      }
      set({ currentUser: user, loading: false })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
    } catch (e) {
      set({
        error: e instanceof ApiError ? `[${e.errorCode}] ${e.message}` : 'Failed to sign in',
        loading: false,
      })
      return null
    }
  },

  setUser(user: User) {
    set({ currentUser: user })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  },

  logout() {
    set({ currentUser: null })
    localStorage.removeItem(STORAGE_KEY)
    window.location.href = '/login'
  },
}))
