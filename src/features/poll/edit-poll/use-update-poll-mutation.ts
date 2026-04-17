import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type Poll } from '@/entities/poll'
import { pollQueryKeys } from '@/entities/poll/api/query-keys'
import { api } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'

interface UpdatePollPayload {
  id: string
  title: string
}

export function useUpdatePollMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, title }: UpdatePollPayload) =>
      api.patch<Poll>(ENDPOINTS.poll.update(id), { title }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: pollQueryKeys.user })
    },
  })
}
