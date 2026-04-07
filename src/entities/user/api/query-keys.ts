export const userQueryKeys = {
  all: ['users'],
  single: (userId: string) => ['users', userId],
  me: ['users', 'current', 'me'],
};
