import { type Game } from '@/entities/game'
import { type Guess, type PollGuess, type UserGuess } from '@/entities/guess'

type TeamInfo = {
  firstTeamName: string | null
  secondTeamName: string | null
  firstTeamCountryCode: string
  secondTeamCountryCode: string
}

export function formatGameDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export function getTeamName(game: TeamInfo, side: 'first' | 'second') {
  if (side === 'first') return game.firstTeamName ?? game.firstTeamCountryCode
  return game.secondTeamName ?? game.secondTeamCountryCode
}

export function toEditableGuess(guess: UserGuess | undefined): Guess | undefined {
  if (!guess?.participant?.id) return undefined

  return {
    id: guess.id,
    createdAt: guess.createdAt,
    firstTeamPoints: guess.firstTeamPoints,
    secondTeamPoints: guess.secondTeamPoints,
    gameId: guess.game.id,
    participantId: guess.participant.id,
  }
}

export function getLatestCompletedGuess(guesses: Array<PollGuess | UserGuess>) {
  return guesses
    .filter((guess) => guess.result.points !== null)
    .sort((first, second) => {
      return new Date(second.game.date).getTime() - new Date(first.game.date).getTime()
    })[0]
}

export interface GuessFormState {
  game: Game
  guess?: Guess
}
