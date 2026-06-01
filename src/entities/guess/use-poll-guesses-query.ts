import { useQuery } from '@tanstack/react-query'

import { type PollGuess } from '@/entities/guess/types'
import { api } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'
import { guessQueryKeys } from './api/query-keys'

export function usePollGuessesQuery(pollId: string) {
  return useQuery({
    queryKey: guessQueryKeys.byPoll(pollId),
    queryFn: () => api.get<PollGuess[]>(ENDPOINTS.guess.byPoll(pollId)),
    enabled: Boolean(pollId),
  })
}
