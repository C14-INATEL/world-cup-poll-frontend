import { useQuery } from '@tanstack/react-query'

import { type User } from '@/entities/user/types'
import { api } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'

export const currentUserQueryKey = ['user', 'current'] as const

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: () => api<User>(ENDPOINTS.auth.me),
    retry: false,
  })
}
