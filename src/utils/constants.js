export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile'
  },
  REPORTS: {
    GET_ALL: '/reports',
    GET_ONE: '/reports/:id',
    CREATE: '/reports',
    UPDATE: '/reports/:id',
    DELETE: '/reports/:id'
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    REPORTS: '/admin/reports'
  }
}

export const DISEASE_TYPES = [
  { id: 1, name: 'Diabetes', category: 'Metabolic' },
  { id: 2, name: 'Hypertension', category: 'Cardiovascular' },
  { id: 3, name: 'Asthma', category: 'Respiratory' }
]

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
}

export const BRAND_LOGO_URL =
  'https://res.cloudinary.com/ddmqb812q/image/upload/v1776794093/WhatsApp_Image_2026-04-21_at_23.09.06_xnjgm2.jpg'

export const GENERAL_ANALYSIS_DISEASE = 'Analyze Any Disease & My Condition'
