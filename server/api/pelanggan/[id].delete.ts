export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  const success = deletePelanggan(id)
  if (!success) {
    throw createError({ statusCode: 404, statusMessage: 'Pelanggan not found' })
  }

  return { success: true }
})
