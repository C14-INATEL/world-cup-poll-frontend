import { useQuery } from '@tanstack/react-query'

import { type Poll } from '@/entities/poll/types'
import { api } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'
import { pollQueryKeys } from './api/query-keys'

export function useUserPollsQuery() {
  return useQuery({
    queryKey: pollQueryKeys.user,
    queryFn: () => api.get<Poll[]>(ENDPOINTS.poll.user),
  })
}
