import { useMutation } from "@tanstack/react-query";

import { type Poll } from "@/entities/poll";
import { api } from "@/shared/api/api";
import { ENDPOINTS } from "@/shared/constants/endpoints";

interface CreatePollPayload {
  title: string;
}

export function useCreatePollMutation() {
  return useMutation({
    mutationFn: (payload: CreatePollPayload) =>
      api.post<Poll>(ENDPOINTS.poll.create, {
        ...payload,
      }),
  });
}
