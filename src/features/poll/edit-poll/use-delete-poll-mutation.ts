import { useMutation, useQueryClient } from '@tanstack/react-query'

import { pollQueryKeys } from '@/entities/poll/api/query-keys'
import { api } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'

export function useDeletePollMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      api.delete(ENDPOINTS.poll.delete(id)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: pollQueryKeys.user })
    },
  })
}
