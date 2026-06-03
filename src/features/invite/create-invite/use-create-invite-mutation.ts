import { useMutation } from '@tanstack/react-query'

import { api } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'

interface CreateInvitePayload {
  pollId: string
  invitedUserId: string
}

export function useCreateInviteMutation() {
  return useMutation({
    mutationFn: (payload: CreateInvitePayload) =>
      api.post(ENDPOINTS.invite.create, payload),
  })
}
