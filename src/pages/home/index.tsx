import { useState } from 'react'

import { type Game } from '@/entities/game'
import { type Guess } from '@/entities/guess'
import { useUserPollsQuery } from '@/entities/poll'
import { CreatePollModal, JoinPollModal } from '@/features/poll'
import { GameGuessesModal } from '@/pages/guesses/ui/game-guesses-modal'
import { GuessFormModal } from '@/pages/guesses/ui/guess-form-modal'
import {
  HomeHeaderSection,
  HomeUserPollsSection,
} from '@/pages/home/ui'

interface GuessFormState {
  game: Game
  guess?: Guess
}

export function HomePage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [participantId, setParticipantId] = useState('')
  const [selectedPollId, setSelectedPollId] = useState('')
  const [guessFormState, setGuessFormState] = useState<GuessFormState | null>(null)
  const [gameGuessesGame, setGameGuessesGame] = useState<Game | null>(null)

  const {
    data: userPolls,
    isPending: isUserPollsPending,
    isError: isUserPollsError,
  } = useUserPollsQuery()


  const handleGuessSuccess = (newParticipantId: string) => {
    if (!participantId) {
      setParticipantId(newParticipantId)
    }
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <HomeHeaderSection />

      <div className="grid grid-cols-1 gap-6">

        <HomeUserPollsSection
          polls={userPolls}
          isPending={isUserPollsPending}
          isError={isUserPollsError}
          onCreatePoll={() => setIsCreateModalOpen(true)}
          onJoinPoll={() => setIsJoinModalOpen(true)}
        />
      </div>

      <CreatePollModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <JoinPollModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
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
