import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type Guess } from '@/entities/guess'
import { guessQueryKeys } from '@/entities/guess/api/query-keys'
import { api } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'

interface CreateGuessPayload {
  pollId: string
  gameId: string
  firstTeamPoints: number
  secondTeamPoints: number
}

export function useCreateGuessMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pollId, gameId, firstTeamPoints, secondTeamPoints }: CreateGuessPayload) =>
      api.post<Guess>(ENDPOINTS.guess.create(pollId), {
        gameId,
        firstTeamPoints,
        secondTeamPoints,
      }),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: guessQueryKeys.byParticipant(data.participantId),
      })
      await queryClient.invalidateQueries({
        queryKey: guessQueryKeys.byGame(data.gameId),
      })
    },
  })
}
