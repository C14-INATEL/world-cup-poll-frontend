export interface Guess {
  id: string
  firstTeamPoints: number
  secondTeamPoints: number
  createdAt: string
  gameId: string
  participantId: string
}

export type GuessResultStatus = 'Pendente' | 'Acertou' | 'Errou' | 'Parcial'

export interface UserGuess {
  id: string
  createdAt: string
  firstTeamPoints: number
  secondTeamPoints: number
  poll: {
    id: string
    title: string
  }
  participant?: {
    id: string
    name: string
  }
  game: {
    id: string
    date: string
    firstTeamName: string | null
    secondTeamName: string | null
    firstTeamCountryCode: string
    secondTeamCountryCode: string
    firstTeamGoals?: number | null
    secondTeamGoals?: number | null
  }
  result: {
    status: GuessResultStatus
    points: number | null
  }
}

export interface PollGuess extends UserGuess {
  participant: {
    id: string
    name: string
  }
}

export interface UserGuessesResponse {
  items: UserGuess[]
  page: number
  limit: number
  total: number
  hasMore: boolean
}
