import { useQuery } from '@tanstack/react-query'

import { type Guess } from '@/entities/guess/types'
import { api } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'
import { guessQueryKeys } from './api/query-keys'

export function useParticipantGuessesQuery(participantId: string) {
  return useQuery({
    queryKey: guessQueryKeys.byParticipant(participantId),
    queryFn: () => api.get<Guess[]>(ENDPOINTS.guess.byParticipant(participantId)),
    enabled: Boolean(participantId),
  })
}
