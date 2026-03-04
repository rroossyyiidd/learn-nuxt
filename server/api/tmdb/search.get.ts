export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const searchQuery = query.query as string || ''
  const page = query.page as string || '1'

  if (!searchQuery) {
    // Return popular movies when no search query
    const response = await $fetch<TTmdbSearchResponse>('https://api.themoviedb.org/3/movie/popular', {
      headers: {
        Authorization: `Bearer ${config.tmdbToken}`,
      },
      query: { language: 'en-US', page },
    })
    return response
  }

  const response = await $fetch<TTmdbSearchResponse>('https://api.themoviedb.org/3/search/movie', {
    headers: {
      Authorization: `Bearer ${config.tmdbToken}`,
    },
    query: { query: searchQuery, language: 'en-US', page },
  })

  return response
})
