export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = pelangganSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.flatten(),
    })
  }

  const pelanggan = addPelanggan(result.data)
  return { pelanggan }
})
