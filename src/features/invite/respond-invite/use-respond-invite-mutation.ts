import { useMutation, useQueryClient } from '@tanstack/react-query';

import { inviteQueryKeys } from '@/entities/invite/api/query-keys';
import { type Invite, type InviteStatus } from '@/entities/invite/types';
import { pollQueryKeys } from '@/entities/poll/api/query-keys';
import { api } from '@/shared/api/api';
import { ENDPOINTS } from '@/shared/constants/endpoints';

interface RespondInvitePayload {
  id: string;
  status: Extract<InviteStatus, 'accepted' | 'declined'>;
}

export function useRespondInviteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: RespondInvitePayload) =>
      api.patch<Invite>(ENDPOINTS.invite.update(id), { status }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: inviteQueryKeys.user }),
        queryClient.invalidateQueries({ queryKey: pollQueryKeys.user }),
      ]);
    },
  });
}
