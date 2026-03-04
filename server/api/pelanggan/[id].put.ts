export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  const body = await readBody(event)
  const result = updatePelangganSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.flatten(),
    })
  }

  const pelanggan = updatePelanggan(id, result.data)
  if (!pelanggan) {
    throw createError({ statusCode: 404, statusMessage: 'Pelanggan not found' })
  }

  return { pelanggan }
})
