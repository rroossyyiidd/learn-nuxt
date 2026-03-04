export const useTmdbSearch = (queryKeyPrefix = 'tmdb-search') => {
  const tmdbSearchQuery = ref('')
  const tmdbQueryKey = ref('')
  const isTmdbLoading = ref(false)

  const { data: tmdbResults } = useQuery({
    queryKey: computed(() => [queryKeyPrefix, tmdbQueryKey.value]),
    queryFn: () => $fetch<TTmdbSearchResponse>('/api/tmdb/search', { query: { query: tmdbQueryKey.value } }),
    enabled: computed(() => !!tmdbQueryKey.value),
  })

  // Map TMDB results to v-autocomplete options
  const tmdbMovieOptions = computed(() => {
    if (!tmdbResults.value?.results) return []
    return tmdbResults.value.results.slice(0, 15).map((movie: TTmdbMovie) => ({
      ...movie,
      id: movie.id,
      label: `${movie.title} (${movie.release_date?.slice(0, 4) || 'N/A'})`,
      poster: movie.poster_path,
      year: movie.release_date?.slice(0, 4) || 'N/A',
      rating: movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : 'N/A',
    }))
  })

  // Debounced watcher on search query
  let tmdbTimeout: ReturnType<typeof setTimeout>
  watch(tmdbSearchQuery, (val) => {
    clearTimeout(tmdbTimeout)
    if (!val || val.length < 2) {
      isTmdbLoading.value = false
      return
    }
    isTmdbLoading.value = true
    tmdbTimeout = setTimeout(() => {
      tmdbQueryKey.value = val
      isTmdbLoading.value = false
    }, 500)
  })

  return {
    tmdbResults,
    isTmdbLoading,
    tmdbSearchQuery,
    tmdbQueryKey,
    tmdbMovieOptions,
  }
}
