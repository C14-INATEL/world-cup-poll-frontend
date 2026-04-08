export const gameQueryKeys = {
  all: ['games'],
  next: (limit: number) => ['games', 'next', limit],
}
