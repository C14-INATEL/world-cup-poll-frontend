import { useQuery } from "@tanstack/react-query";

import { type Game } from "@/entities/game/types";
import { api } from "@/shared/api/api";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import { gameQueryKeys } from "./api/query-keys";

interface UseNextGamesQueryOptions {
  limit?: number | null;
  daysAhead?: number;
}

export function useNextGamesQuery({ limit = 5, daysAhead }: UseNextGamesQueryOptions = {}) {
  return useQuery({
    queryKey: gameQueryKeys.next(limit, daysAhead),
    queryFn: async () => {
      const games = await api.get<Game[]>(ENDPOINTS.game.list);
      const now = Date.now();
      const endDate = daysAhead ? now + daysAhead * 24 * 60 * 60 * 1000 : null;

      const sortedGames = games
        .filter(
          (game) =>
            new Date(game.date).getTime() >= now &&
            (!endDate || new Date(game.date).getTime() <= endDate) &&
            game.secondTeamName &&
            game.firstTeamName,
        )
        .sort((firstGame, secondGame) => {
          return new Date(firstGame.date).getTime() - new Date(secondGame.date).getTime();
        });

      return limit ? sortedGames.slice(0, limit) : sortedGames;
    },
  });
}
