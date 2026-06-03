import { useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { useAuth } from '@/app/providers/auth/use-auth'
import { type Game, useNextGamesQuery } from '@/entities/game'
import { usePollGuessesQuery, useUserGuessesQuery } from '@/entities/guess'
import { useUserPollsQuery } from '@/entities/poll'
import { usePollRankingQuery } from '@/entities/ranking'
import { GameGuessesModal } from '@/pages/guesses/ui/game-guesses-modal'
import { GuessFormModal } from '@/pages/guesses/ui/guess-form-modal'
import {
  GroupGamesSection,
  GroupHeaderSection,
  GroupLastResultSection,
  GroupRankingPanel,
  GroupUserGuessesPanel,
  InviteUserModal,
  LastResultsModal,
  type GuessFormState,
  getLatestCompletedGuess,
} from '@/pages/group/ui'
import { ROUTES } from '@/shared/constants/routes'

export function GroupPage() {
  const { pollCode = '' } = useParams()
  const { user } = useAuth()
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false)
  const [guessFormState, setGuessFormState] = useState<GuessFormState | null>(null)
  const [gameGuessesGame, setGameGuessesGame] = useState<Game | null>(null)

  const pollsQuery = useUserPollsQuery()
  const poll = pollsQuery.data?.find((item) => item.code === pollCode)
  const pollId = poll?.id ?? ''

  const gamesQuery = useNextGamesQuery({ limit: null })
  const rankingQuery = usePollRankingQuery(pollId)
  const pollGuessesQuery = usePollGuessesQuery(pollId)
  const userGuessesQuery = useUserGuessesQuery({ page: 1, limit: 50 })

  const games = gamesQuery.data ?? []
  const pollGuesses = pollGuessesQuery.data ?? []
  const myPollGuesses = (userGuessesQuery.data?.items ?? []).filter(
    (guess) => guess.poll.id === pollId,
  )

  const allResultGuesses = useMemo(
    () => [...pollGuesses, ...myPollGuesses],
    [pollGuesses, myPollGuesses],
  )
  const latestCompletedGuess = getLatestCompletedGuess(allResultGuesses)

  const openGuessForm = (game: Game, guess?: GuessFormState['guess']) => {
    setGuessFormState({ game, guess })
  }

  if (!pollCode) {
    return <Navigate to={ROUTES.home} replace />
  }

  if (!pollsQuery.isPending && !poll) {
    return <Navigate to={ROUTES.home} replace />
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <GroupHeaderSection
        poll={poll}
        currentUserId={user?.id}
        isPending={pollsQuery.isPending}
        onInvite={() => setIsInviteModalOpen(true)}
      />

      <GroupLastResultSection
        latestCompletedGuess={latestCompletedGuess}
        onViewMore={() => setIsResultsModalOpen(true)}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <GroupRankingPanel
          ranking={rankingQuery.data}
          participants={poll?.participants ?? []}
          isPending={rankingQuery.isPending}
          isError={rankingQuery.isError}
        />

        <GroupGamesSection
          games={games}
          myGuesses={myPollGuesses}
          hasPoll={Boolean(poll)}
          isPending={gamesQuery.isPending}
          isError={gamesQuery.isError}
          onPalpitar={openGuessForm}
          onVerPalpites={setGameGuessesGame}
        />

        <GroupUserGuessesPanel
          guesses={myPollGuesses}
          firstGame={games[0]}
          onAddGuess={(game) => openGuessForm(game)}
        />
      </div>

      {isInviteModalOpen && (
        <InviteUserModal pollId={pollId} onClose={() => setIsInviteModalOpen(false)} />
      )}

      {isResultsModalOpen && (
        <LastResultsModal
          guesses={allResultGuesses}
          currentUserName={user?.name ?? 'Voce'}
          onClose={() => setIsResultsModalOpen(false)}
        />
      )}

      {guessFormState && poll && (
        <GuessFormModal
          game={guessFormState.game}
          guess={guessFormState.guess}
          pollId={poll.id}
          polls={[poll]}
          hidePollSelect
          onChangePoll={() => undefined}
          onClose={() => setGuessFormState(null)}
          onSuccess={() => undefined}
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
