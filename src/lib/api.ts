const apiUrlFromEnv: unknown = import.meta.env.VITE_API_URL
const API_BASE_URL =
  typeof apiUrlFromEnv === 'string' && apiUrlFromEnv.length > 0
    ? apiUrlFromEnv
    : '/api'

interface ApiSuccessResponse<T> {
  error: null
  data: T
}

interface ApiErrorResponse {
  error: string
  data: null
}

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export async function login(payload: LoginPayload): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  const responseBody = (await response.json()) as ApiResponse<AuthUser>

  if (!response.ok || responseBody.error !== null) {
    const message =
      responseBody.error ??
      'Nao foi possivel realizar login. Tente novamente mais tarde.'
    throw new Error(message)
  }

  return responseBody.data
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  const responseBody = (await response.json()) as ApiResponse<AuthUser>

  if (!response.ok || responseBody.error !== null) {
    const message =
      responseBody.error ??
      'Nao foi possivel criar a conta. Tente novamente mais tarde.'
    throw new Error(message)
  }

  return responseBody.data
}
