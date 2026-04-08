import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { type Poll } from "@/entities/poll";
import { pollQueryKeys } from "@/entities/poll/api/query-keys";
import { api } from "@/shared/api/api";
import { ENDPOINTS } from "@/shared/constants/endpoints";

interface CreatePollPayload {
  title: string;
}

export function useCreatePollMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePollPayload) =>
      api.post<Poll>(ENDPOINTS.poll.create, {
        ...payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: pollQueryKeys.user });
    },
  });
}
