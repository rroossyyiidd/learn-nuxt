export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  const sewa = getSewaById(id)
  if (!sewa) {
    throw createError({ statusCode: 404, statusMessage: 'Sewa not found' })
  }

  return { sewa }
})
