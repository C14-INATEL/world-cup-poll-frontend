interface ApiSuccessResponse<T> {
  error: null
  data: T
}

interface ApiErrorResponse {
  error: string
  data: null
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export async function api<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: 'include',
    ...init,
  })

  const json = (await response.json()) as ApiResponse<T>

  if (!response.ok || json.error !== null) {
    throw new Error(json.error ?? 'Unexpected request error')
  }

  return json.data
}
