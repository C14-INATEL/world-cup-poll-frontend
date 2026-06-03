import { useQuery } from '@tanstack/react-query'

import { type RankingEntry } from '@/entities/ranking/types'
import { api } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'
import { rankingQueryKeys } from './api/query-keys'

export function usePollRankingQuery(pollId: string) {
  return useQuery({
    queryKey: rankingQueryKeys.byPoll(pollId),
    queryFn: () => api.get<RankingEntry[]>(ENDPOINTS.ranking.byPoll(pollId)),
    enabled: Boolean(pollId),
  })
}
