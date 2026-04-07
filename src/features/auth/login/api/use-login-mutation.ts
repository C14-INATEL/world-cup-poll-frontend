import { useMutation } from '@tanstack/react-query'

import { type User } from '@/entities/user/model/types'
import { api } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'

interface LoginPayload {
  email: string
  password: string
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      api<User>(ENDPOINTS.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
  })
}
