import { useMutation, useQueryClient } from '#imports'
import type { TPelangganDetailResponse } from '../-types/pelanggan'

export const useAddPelanggan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      $fetch('/api/pelanggan', { method: 'POST', body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pelanggan'] })
    },
  })
}

export const useUpdatePelanggan = (pelangganId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      $fetch<TPelangganDetailResponse>(`/api/pelanggan/${pelangganId}`, { method: 'PUT', body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pelanggan'] })
      queryClient.invalidateQueries({ queryKey: ['pelanggan-detail', pelangganId] })
    },
  })
}

export const useDeletePelanggan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pelangganId: string) =>
      $fetch<{ success: boolean }>(`/api/pelanggan/${pelangganId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pelanggan'] })
    },
  })
}
