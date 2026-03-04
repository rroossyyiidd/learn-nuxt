export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase()
  const status = query.status as string || ''

  let sewa = getSewaList()

  if (search) {
    sewa = sewa.filter(
      (s) =>
        s.pelangganName.toLowerCase().includes(search)
        || s.items.some((i) => i.filmTitle.toLowerCase().includes(search)),
    )
  }

  if (status) {
    sewa = sewa.filter((s) => s.status === status)
  }

  return { sewa, total: sewa.length }
})
