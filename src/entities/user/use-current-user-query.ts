import { useQuery } from "@tanstack/react-query";

import { type User } from "@/entities/user/types";
import { api } from "@/shared/api/api";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import { userQueryKeys } from "./api/query-keys";

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: userQueryKeys.me,
    queryFn: () => api.get<User>(ENDPOINTS.auth.me).then((res) => res),
  });
}
