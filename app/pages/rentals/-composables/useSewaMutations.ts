import { useMutation, useQueryClient } from '#imports'
import type { TSewaDetailResponse } from '../-types/sewa'

export const useAddSewa = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      $fetch('/api/sewa', { method: 'POST', body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sewa'] })
    },
  })
}

export const useUpdateSewa = (sewaId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      $fetch<TSewaDetailResponse>(`/api/sewa/${sewaId}`, { method: 'PUT', body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sewa'] })
      queryClient.invalidateQueries({ queryKey: ['sewa-detail', sewaId] })
    },
  })
}

export const useDeleteSewa = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sewaId: string) =>
      $fetch<{ success: boolean }>(`/api/sewa/${sewaId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sewa'] })
    },
  })
}
