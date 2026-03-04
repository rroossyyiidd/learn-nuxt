export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  const pelanggan = getPelangganById(id)
  if (!pelanggan) {
    throw createError({ statusCode: 404, statusMessage: 'Pelanggan not found' })
  }

  return { pelanggan }
})
