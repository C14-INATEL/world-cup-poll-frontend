const API_BASE_URL = 'http://localhost:3333'

export const ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    me: `${API_BASE_URL}/me`,
  },
  poll: {
    create: `${API_BASE_URL}/poll/create`,
  },
} as const
