


export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  const film = getFilmById(id)
  if (!film) {
    throw createError({ statusCode: 404, statusMessage: 'Film not found' })
  }

  return { film }
})
