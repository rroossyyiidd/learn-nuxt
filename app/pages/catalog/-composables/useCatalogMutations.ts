import { useMutation, useQueryClient } from '#imports'
import type { TFilmResponse } from '../-types/film'

export const useAddCatalog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      $fetch('/api/catalog', { method: 'POST', body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] })
      queryClient.invalidateQueries({ queryKey: ['catalog-stats'] })
    },
  })
}

export const useUpdateCatalog = (filmId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      $fetch<TFilmResponse>(`/api/catalog/${filmId}`, { method: 'PUT', body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] })
      queryClient.invalidateQueries({ queryKey: ['catalog-stats'] })
      queryClient.invalidateQueries({ queryKey: ['catalog-film', filmId] })
    },
  })
}

export const useDeleteCatalog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (filmId: string) =>
      $fetch<{ success: boolean }>(`/api/catalog/${filmId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] })
      queryClient.invalidateQueries({ queryKey: ['catalog-stats'] })
    },
  })
}

export const useImportCatalogFromTmdb = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      $fetch('/api/catalog', { method: 'POST', body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] })
      queryClient.invalidateQueries({ queryKey: ['catalog-stats'] })
    },
  })
}
