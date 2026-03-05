export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase()
  const genre = query.genre as string || ''

  let films = getFilms()

  if (search) {
    films = films.filter(
      (f) =>
        f.title.toLowerCase().includes(search) ||
        f.overview.toLowerCase().includes(search),
    )
  }

  if (genre) {
    films = films.filter((f) => f.genres.includes(genre))
  }

  return { films, total: films.length }
})
