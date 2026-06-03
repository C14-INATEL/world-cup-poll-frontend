export const rankingQueryKeys = {
  all: ['ranking'],
  byPoll: (pollId: string) => ['ranking', 'poll', pollId],
}
