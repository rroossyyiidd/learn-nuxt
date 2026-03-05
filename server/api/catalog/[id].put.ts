export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  const body = await readBody(event)
  const result = updateFilmSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.flatten(),
    })
  }

  const film = updateFilm(id, result.data)
  if (!film) {
    throw createError({ statusCode: 404, statusMessage: 'Film not found' })
  }

  return { film }
})
