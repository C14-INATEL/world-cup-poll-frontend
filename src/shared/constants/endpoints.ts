export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/me',
  },
  game: {
    list: '/games',
  },
  poll: {
    create: '/poll/create',
    user: '/polls/user',
  },
} as const
