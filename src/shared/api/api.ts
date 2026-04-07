interface ApiSuccessResponse<T> {
  error: null
  data: T
}

interface ApiErrorResponse {
  error: string
  data: null
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

const defaultApiBaseUrl = 'http://localhost:3333'

function resolveApiInput(input: string): string {
  if (/^https?:\/\//.test(input)) {
    return input
  }

  const apiBaseUrl = (import.meta.env.VITE_API_URL ?? defaultApiBaseUrl).replace(/\/$/, '')
  const endpointPath = input.startsWith('/') ? input : `/${input}`

  return `${apiBaseUrl}${endpointPath}`
}

export async function api<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(resolveApiInput(input), {
    credentials: 'include',
    ...init,
  })

  const json = (await response.json()) as ApiResponse<T>

  if (!response.ok || json.error !== null) {
    throw new Error(json.error ?? 'Unexpected request error')
  }

  return json.data
}
