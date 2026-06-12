import { useQuery } from '@tanstack/react-query';

import { type Invite } from '@/entities/invite/types';
import { api } from '@/shared/api/api';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { inviteQueryKeys } from './api/query-keys';

export function useUserInvitesQuery(enabled = true) {
  return useQuery({
    queryKey: inviteQueryKeys.user,
    queryFn: () => api.get<Invite[]>(ENDPOINTS.invite.user),
    enabled,
    refetchInterval: 30_000,
  });
}
