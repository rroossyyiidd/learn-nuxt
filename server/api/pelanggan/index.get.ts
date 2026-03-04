export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase()
  const membership = query.membership as string || ''

  let pelanggan = getPelangganList()

  if (search) {
    pelanggan = pelanggan.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.email.toLowerCase().includes(search) ||
        p.phone.includes(search),
    )
  }

  if (membership) {
    pelanggan = pelanggan.filter((p) => p.membershipType === membership)
  }

  return { pelanggan, total: pelanggan.length }
})
