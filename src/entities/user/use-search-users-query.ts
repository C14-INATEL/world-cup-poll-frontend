import { useQuery } from '@tanstack/react-query'

import { type User } from '@/entities/user/types'
import { api } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'
import { userQueryKeys } from './api/query-keys'

export function useSearchUsersQuery(query: string) {
  const normalizedQuery = query.trim()

  return useQuery({
    queryKey: userQueryKeys.search(normalizedQuery),
    queryFn: () =>
      api.get<User[]>(ENDPOINTS.user.search, {
        params: { query: normalizedQuery },
      }),
    enabled: normalizedQuery.length >= 2,
  })
}
