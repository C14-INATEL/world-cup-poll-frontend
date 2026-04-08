import { CreatePollModal } from "@/features/poll";
import { useUserPollsQuery } from "@/entities/poll";
import { useNextGamesQuery } from "@/entities/game";
import {
  HomeHeaderSection,
  HomeNextGamesSection,
  HomeUserPollsSection,
} from "@/pages/home/ui";
import { useState } from "react";

export function HomePage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    data: nextGames,
    isPending: isNextGamesPending,
    isError: isNextGamesError,
  } = useNextGamesQuery({ limit: 5 });

  const {
    data: userPolls,
    isPending: isUserPollsPending,
    isError: isUserPollsError,
  } = useUserPollsQuery();

  return (
    <div className="flex w-full flex-col gap-6">
      <HomeHeaderSection />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_1fr]">
        <HomeNextGamesSection
          games={nextGames}
          isPending={isNextGamesPending}
          isError={isNextGamesError}
        />

        <HomeUserPollsSection
          polls={userPolls}
          isPending={isUserPollsPending}
          isError={isUserPollsError}
          onCreatePoll={() => {
            setIsCreateModalOpen(true);
          }}
        />
      </div>

      <CreatePollModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}
