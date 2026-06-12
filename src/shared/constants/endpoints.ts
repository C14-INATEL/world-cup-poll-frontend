export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/me',
  },
  user: {
    updateProfile: '/me',
    search: '/users/search',
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
  invite: {
    create: '/poll/invite',
    user: '/me/invites',
    update: (id: string) => `/invite/${id}`,
  },
  ranking: {
    byPoll: (pollId: string) => `/polls/${pollId}/ranking`,
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
