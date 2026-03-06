import axios from 'axios'
import type { AxiosError } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Backend response format: { statusCode, data, timestamp }
interface ApiSuccessResponse<T = unknown> {
  statusCode: number
  data: T
  timestamp: string
}

// Backend error format: { statusCode, errorCode, message, timestamp, path }
export interface ApiErrorResponse {
  statusCode: number
  errorCode: string
  message: string
  timestamp: string
  path: string
}

export class ApiError extends Error {
  statusCode: number
  errorCode: string

  constructor(statusCode: number, errorCode: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errorCode = errorCode
  }
}

// Unwrap success response: { statusCode, data, timestamp } → data
api.interceptors.response.use(
  (response) => {
    const body = response.data as ApiSuccessResponse
    if (body && typeof body === 'object' && 'data' in body && 'timestamp' in body) {
      response.data = body.data
    }
    return response
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const res = error.response?.data
    if (res && res.errorCode) {
      return Promise.reject(new ApiError(res.statusCode, res.errorCode, res.message))
    }
    return Promise.reject(error)
  },
)

export default api
