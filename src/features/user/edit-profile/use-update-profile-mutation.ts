import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userQueryKeys } from "@/entities/user/api/query-keys";
import { type User } from "@/entities/user/types";
import { api } from "@/shared/api/api";
import { ENDPOINTS } from "@/shared/constants/endpoints";

interface UpdateProfilePayload {
  name: string;
  email: string;
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      api.patch<User>(ENDPOINTS.user.updateProfile, payload),
    onSuccess: (user) => {
      queryClient.setQueryData(userQueryKeys.me, user);
    },
  });
}
