export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = sewaSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.flatten(),
    })
  }

  const sewa = addSewa(result.data)
  return { sewa }
})
