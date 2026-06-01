import { useQuery } from '@tanstack/react-query'

import { type UserGuessesResponse } from '@/entities/guess/types'
import { api } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'
import { guessQueryKeys } from './api/query-keys'

interface UseUserGuessesQueryOptions {
  page: number
  limit?: number
}

export function useUserGuessesQuery({ page, limit = 10 }: UseUserGuessesQueryOptions) {
  return useQuery({
    queryKey: guessQueryKeys.user(page, limit),
    queryFn: () =>
      api.get<UserGuessesResponse>(ENDPOINTS.guess.user, {
        params: { page, limit },
      }),
  })
}
