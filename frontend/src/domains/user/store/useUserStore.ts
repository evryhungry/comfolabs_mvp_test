import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, CreateUserDto } from '../model/User'
import { userApi } from '../service/userApi'
import { ApiError } from '../../../shared/api'

const STORAGE_KEY = 'comfolabs_user'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        currentUser.value = JSON.parse(saved)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  async function createUser(dto: CreateUserDto) {
    loading.value = true
    error.value = null
    try {
      const user = await userApi.create(dto)
      currentUser.value = user
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
    } catch (e) {
      error.value = e instanceof ApiError ? `[${e.errorCode}] ${e.message}` : 'Failed to create user'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function signIn(email: string) {
    loading.value = true
    error.value = null
    try {
      const user = await userApi.findByEmail(email)
      if (!user) {
        error.value = 'No account found with this email'
        return null
      }
      currentUser.value = user
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
    } catch (e) {
      error.value = e instanceof ApiError ? `[${e.errorCode}] ${e.message}` : 'Failed to sign in'
      return null
    } finally {
      loading.value = false
    }
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  loadFromStorage()

  return { currentUser, loading, error, createUser, signIn, logout }
})
