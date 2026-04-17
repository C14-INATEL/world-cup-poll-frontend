import { useState } from 'react'

import { type Game, useNextGamesQuery } from '@/entities/game'
import { type Guess, useParticipantGuessesQuery } from '@/entities/guess'
import { useUserPollsQuery } from '@/entities/poll'
import { CreatePollModal } from '@/features/poll'
import { GameGuessesModal } from '@/pages/guesses/ui/game-guesses-modal'
import { GuessFormModal } from '@/pages/guesses/ui/guess-form-modal'
import {
  HomeHeaderSection,
  HomeNextGamesSection,
  HomeUserPollsSection,
} from '@/pages/home/ui'

interface GuessFormState {
  game: Game
  guess?: Guess
}

export function HomePage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [participantId, setParticipantId] = useState('')
  const [selectedPollId, setSelectedPollId] = useState('')
  const [guessFormState, setGuessFormState] = useState<GuessFormState | null>(null)
  const [gameGuessesGame, setGameGuessesGame] = useState<Game | null>(null)

  const {
    data: nextGames,
    isPending: isNextGamesPending,
    isError: isNextGamesError,
  } = useNextGamesQuery({ limit: 5 })

  const {
    data: userPolls,
    isPending: isUserPollsPending,
    isError: isUserPollsError,
  } = useUserPollsQuery()

  const { data: myGuesses = [] } = useParticipantGuessesQuery(participantId)

  const handleGuessSuccess = (newParticipantId: string) => {
    if (!participantId) {
      setParticipantId(newParticipantId)
    }
  }

  const handlePalpitar = (game: Game) => {
    const myGuess = myGuesses.find((g) => g.gameId === game.id)
    setGuessFormState({ game, guess: myGuess })
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <HomeHeaderSection />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_1fr]">
        <HomeNextGamesSection
          games={nextGames}
          isPending={isNextGamesPending}
          isError={isNextGamesError}
          myGuesses={myGuesses}
          polls={userPolls ?? []}
          onPalpitar={handlePalpitar}
          onVerPalpites={setGameGuessesGame}
        />

        <HomeUserPollsSection
          polls={userPolls}
          isPending={isUserPollsPending}
          isError={isUserPollsError}
          onCreatePoll={() => setIsCreateModalOpen(true)}
        />
      </div>

      <CreatePollModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {guessFormState && (
        <GuessFormModal
          game={guessFormState.game}
          guess={guessFormState.guess}
          pollId={selectedPollId}
          polls={userPolls ?? []}
          onChangePoll={setSelectedPollId}
          onClose={() => setGuessFormState(null)}
          onSuccess={handleGuessSuccess}
        />
      )}

      {gameGuessesGame && (
        <GameGuessesModal
          game={gameGuessesGame}
          onClose={() => setGameGuessesGame(null)}
        />
      )}
    </div>
  )
}
