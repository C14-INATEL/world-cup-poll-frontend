import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type AuthSession, type UserRegister } from "@/entities/user/types";
import { api } from "@/shared/api/api";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import { userQueryKeys } from "@/entities/user/api/query-keys";

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserRegister) => api.post<AuthSession>(ENDPOINTS.auth.register, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.me });
    },
  });
}
