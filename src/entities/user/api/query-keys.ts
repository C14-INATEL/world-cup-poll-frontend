export const userQueryKeys = {
  all: ['users'],
  single: (userId: string) => ['users', userId],
  me: ['users', 'current', 'me'],
  search: (query: string) => ['users', 'search', query],
};
