import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type User } from "@/entities/user/types";
import { api } from "@/shared/api/api";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import { userQueryKeys } from "@/entities/user/api/query-keys";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      api.post<User>(ENDPOINTS.auth.register, {
        ...payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.me });
    },
  });
}
