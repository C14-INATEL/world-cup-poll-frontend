import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type User } from "@/entities/user/types";
import { api } from "@/shared/api/api";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import { userQueryKeys } from "@/entities/user/api/query-keys";

interface LoginPayload {
  email: string;
  password: string;
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      api.post<User>(ENDPOINTS.auth.login, {
        ...payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.me });
    },
  });
}
