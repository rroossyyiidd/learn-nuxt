export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const response = await $fetch<TTmdbGenresResponse>('https://api.themoviedb.org/3/genre/movie/list', {
    headers: {
      Authorization: `Bearer ${config.tmdbToken}`,
    },
    query: { language: 'en-US' },
  })

  return response
})
