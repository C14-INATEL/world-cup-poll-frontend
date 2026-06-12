import type { Game } from '@/entities/game/types'
import type { Guess, UserGuess } from '@/entities/guess/types'
import type { Invite } from '@/entities/invite/types'
import type { Poll } from '@/entities/poll/types'
import type { User } from '@/entities/user/types'

export const mockUser: User = {
  id: 'user-1',
  name: 'Ana Clara',
  email: 'ana@example.com',
}

export const mockPoll: Poll = {
  id: 'poll-1',
  title: 'Meu Bolao',
  code: 'BOLAO12345',
  createdAt: '2026-01-01T00:00:00.000Z',
  ownerId: 'user-1',
  ownerName: 'Ana Clara',
  participants: ['user-1'],
}

export const mockInvite: Invite = {
  id: 'invite-1',
  pollId: mockPoll.id,
  invitedUserId: mockUser.id,
  invitedBy: 'user-2',
  status: 'pending',
  expiresAt: '2027-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  pollTitle: mockPoll.title,
  pollCode: mockPoll.code,
  invitedByName: 'Bruno Lima',
}

export const mockGame: Game = {
  id: 'game-1',
  date: new Date(Date.now() + 86_400_000).toISOString(),
  status: 'SCHEDULED',
  apiId: 1,
  firstTeamCountryCode: 'BRA',
  secondTeamCountryCode: 'ARG',
  firstTeamName: 'Brasil',
  secondTeamName: 'Argentina',
  firstTeamGoals: null,
  secondTeamGoals: null,
  firstTeamCrestUrl: null,
  secondTeamCrestUrl: null,
}

export const mockGuess: Guess = {
  id: 'guess-1',
  firstTeamPoints: 2,
  secondTeamPoints: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  gameId: 'game-1',
  participantId: 'part-1',
}

export const mockUserGuess: UserGuess = {
  id: 'uguess-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  firstTeamPoints: 2,
  secondTeamPoints: 1,
  poll: { id: 'poll-1', title: 'Meu Bolao' },
  game: {
    id: 'game-1',
    date: '2027-06-01T20:00:00.000Z',
    firstTeamName: 'Brasil',
    secondTeamName: 'Argentina',
    firstTeamCountryCode: 'BRA',
    secondTeamCountryCode: 'ARG',
  },
  result: { status: 'Pendente', points: null },
}

export const emptyGuessesResponse = {
  items: [],
  page: 1,
  limit: 10,
  total: 0,
  hasMore: false,
}
