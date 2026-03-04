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

  const film = addFilm({
    ...result.data,
    posterPath: result.data.posterPath ?? null,
    backdropPath: result.data.backdropPath ?? null,
    tmdbId: result.data.tmdbId ?? null,
  })
  return { film }
})
