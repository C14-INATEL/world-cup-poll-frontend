import { useQuery } from "@tanstack/react-query";

import { type Game } from "@/entities/game/types";
import { api } from "@/shared/api/api";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import { gameQueryKeys } from "./api/query-keys";

interface UseNextGamesQueryOptions {
  limit?: number;
}

export function useNextGamesQuery({ limit = 5 }: UseNextGamesQueryOptions = {}) {
  return useQuery({
    queryKey: gameQueryKeys.next(limit),
    queryFn: async () => {
      const games = await api.get<Game[]>(ENDPOINTS.game.list);
      const now = Date.now();

      return games
        .filter(
          (game) =>
            new Date(game.date).getTime() >= now && game.secondTeamName && game.firstTeamName,
        )
        .sort((firstGame, secondGame) => {
          return new Date(firstGame.date).getTime() - new Date(secondGame.date).getTime();
        })
        .slice(0, limit);
    },
  });
}
