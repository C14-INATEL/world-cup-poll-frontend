import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type Guess } from '@/entities/guess'
import { guessQueryKeys } from '@/entities/guess/api/query-keys'
import { api } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'

interface UpdateGuessPayload {
  pollId: string
  guessId: string
  participantId: string
  gameId: string
  firstTeamPoints: number
  secondTeamPoints: number
}

export function useUpdateGuessMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pollId, guessId, firstTeamPoints, secondTeamPoints }: UpdateGuessPayload) =>
      api.put<Guess>(ENDPOINTS.guess.update(pollId, guessId), {
        firstTeamPoints,
        secondTeamPoints,
      }),
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: guessQueryKeys.byParticipant(variables.participantId),
      })
      await queryClient.invalidateQueries({
        queryKey: guessQueryKeys.byGame(data.gameId),
      })
    },
  })
}
