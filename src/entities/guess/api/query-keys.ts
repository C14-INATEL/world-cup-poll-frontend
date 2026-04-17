export const guessQueryKeys = {
  all: ['guesses'],
  byParticipant: (participantId: string) => ['guesses', 'participant', participantId],
  byGame: (gameId: string) => ['guesses', 'game', gameId],
}
