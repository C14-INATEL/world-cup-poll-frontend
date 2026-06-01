export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/me',
  },
  user: {
    updateProfile: '/me',
  },
  game: {
    list: '/games',
  },
  poll: {
    create: '/poll/create',
    join: '/poll/join',
    user: '/polls/user',
    update: (id: string) => `/poll/${id}`,
    delete: (id: string) => `/poll/${id}`,
  },
  guess: {
    create: (pollId: string) => `/polls/${pollId}/guess/create`,
    update: (pollId: string, guessId: string) => `/polls/${pollId}/guess/${guessId}/update`,
    byParticipant: (participantId: string) => `/guess/participant/${participantId}`,
    byGame: (gameId: string) => `/guess/game/${gameId}`,
    byPoll: (pollId: string) => `/polls/${pollId}/guesses`,
    user: '/guess/user',
  },
} as const
