import axios from 'axios'

const DEFAULT_API_BASE_URL = 'https://backend-chi-red-56.vercel.app/api'
const normalizeBaseUrl = (url) => url.replace(/\/+$/, '')
export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL)

export const buildApiAssetUrl = (resourcePath = '') => {
  if (!resourcePath) {
    return ''
  }

  if (/^https?:\/\//i.test(resourcePath)) {
    return resourcePath
  }

  if (API_BASE_URL.startsWith('http')) {
    return new URL(resourcePath, new URL(API_BASE_URL).origin).toString()
  }

  return new URL(resourcePath, window.location.origin).toString()
}

const api = axios.create({
  baseURL: API_BASE_URL
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
