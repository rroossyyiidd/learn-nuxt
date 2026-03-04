export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  const body = await readBody(event)
  const result = updateSewaSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.flatten(),
    })
  }

  const sewa = updateSewa(id, result.data)
  if (!sewa) {
    throw createError({ statusCode: 404, statusMessage: 'Sewa not found' })
  }

  return { sewa }
})
