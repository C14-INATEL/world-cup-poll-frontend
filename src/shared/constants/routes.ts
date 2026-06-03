export const ROUTES = {
  root: '/',
  auth: '/login',
  home: '/home',
  guesses: '/guess',
  profile: '/profile',
  group: '/groups/:pollCode',
  groupDetails: (pollCode: string) => `/groups/${pollCode}`,
} as const
