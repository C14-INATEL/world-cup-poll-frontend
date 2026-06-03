export const gameQueryKeys = {
  all: ['games'],
  next: (limit?: number | null, daysAhead?: number) => ['games', 'next', limit, daysAhead],
}
