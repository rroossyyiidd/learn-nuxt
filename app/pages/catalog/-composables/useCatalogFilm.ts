import { useQuery } from '#imports'
import type { TFilmResponse } from '../-types/film'

export const useCatalogFilm = (filmId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['catalog-film', filmId],
    queryFn: () => $fetch<TFilmResponse>(`/api/catalog/${filmId}`),
  })

  return { data, isLoading, error }
}
