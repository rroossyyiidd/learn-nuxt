export const useTmdbGenres = () => {
  const { data: tmdbGenres } = useQuery({
    queryKey: ['tmdb-genres'],
    queryFn: () => $fetch<TTmdbGenresResponse>('/api/tmdb/genres'),
  })

  const genreMap = computed(() => {
    const map: Record<number, string> = {}
    tmdbGenres.value?.genres?.forEach((g: TTmdbGenre) => {
      map[g.id] = g.name
    })
    return map
  })

  return { tmdbGenres, genreMap }
}
