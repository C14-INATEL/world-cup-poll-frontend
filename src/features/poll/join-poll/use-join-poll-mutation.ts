import { useMutation, useQueryClient } from "@tanstack/react-query";

import { pollQueryKeys } from "@/entities/poll/api/query-keys";
import { api } from "@/shared/api/api";
import { ENDPOINTS } from "@/shared/constants/endpoints";

interface JoinPollPayload {
  code: string;
}

export function useJoinPollMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: JoinPollPayload) => api.post(ENDPOINTS.poll.join, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: pollQueryKeys.user });
    },
  });
}
