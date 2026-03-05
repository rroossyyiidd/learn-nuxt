export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = filmSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.flatten(),
    })
  }

  if (result.data.tmdbId) {
    const existing = getFilms().find(f => f.tmdbId === result.data.tmdbId)
    if (existing) {
      throw createError({
        statusCode: 409,
        statusMessage: `Film "${existing.title}" sudah ada di catalog`,
      })
    }
  }

  const film = addFilm({
    ...result.data,
    posterPath: result.data.posterPath ?? null,
    backdropPath: result.data.backdropPath ?? null,
    tmdbId: result.data.tmdbId ?? null,
  })
  return { film }
})
