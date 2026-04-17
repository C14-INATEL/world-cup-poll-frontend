import { useQuery } from '@tanstack/react-query'

import { type Guess } from '@/entities/guess/types'
import { api } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'
import { guessQueryKeys } from './api/query-keys'

export function useGameGuessesQuery(gameId: string) {
  return useQuery({
    queryKey: guessQueryKeys.byGame(gameId),
    queryFn: () => api.get<Guess[]>(ENDPOINTS.guess.byGame(gameId)),
    enabled: Boolean(gameId),
  })
}
