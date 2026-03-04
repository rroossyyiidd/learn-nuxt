export type TFilm = {
  id: string
  tmdbId: number | null
  title: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  releaseDate: string
  genres: string[]
  rating: number
  stock: number
  rentalPrice: number
  createdAt: string
  updatedAt: string
}

// In-memory storage
const films: TFilm[] = [
  {
    id: '1',
    tmdbId: 27205,
    title: 'Inception',
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    posterPath: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdropPath: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    releaseDate: '2010-07-15',
    genres: ['Action', 'Science Fiction', 'Adventure'],
    rating: 8.4,
    stock: 5,
    rentalPrice: 15000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    tmdbId: 155,
    title: 'The Dark Knight',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.',
    posterPath: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdropPath: '/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
    releaseDate: '2008-07-14',
    genres: ['Drama', 'Action', 'Crime', 'Thriller'],
    rating: 9.0,
    stock: 4,
    rentalPrice: 15000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    tmdbId: 157336,
    title: 'Interstellar',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    posterPath: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropPath: '/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    releaseDate: '2014-11-05',
    genres: ['Adventure', 'Drama', 'Science Fiction'],
    rating: 8.6,
    stock: 6,
    rentalPrice: 15000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

let nextId = 4

export function getFilms(): TFilm[] {
  return films
}

export function getFilmById(id: string): TFilm | undefined {
  return films.find((f) => f.id === id)
}

export function addFilm(data: Omit<TFilm, 'id' | 'createdAt' | 'updatedAt'>): TFilm {
  const film: TFilm = {
    ...data,
    id: String(nextId++),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  films.push(film)
  return film
}

export function updateFilm(id: string, data: Partial<Omit<TFilm, 'id' | 'createdAt' | 'updatedAt'>>): TFilm | null {
  const index = films.findIndex((f) => f.id === id)
  if (index === -1) return null
  films[index] = {
    ...films[index]!,
    ...data,
    updatedAt: new Date().toISOString(),
  }
  return films[index] ?? null
}

export function deleteFilm(id: string): boolean {
  const index = films.findIndex((f) => f.id === id)
  if (index === -1) return false
  films.splice(index, 1)
  return true
}

export function getCatalogStats() {
  const genreSet = new Set<string>()
  films.forEach((f) => f.genres.forEach((g) => genreSet.add(g)))

  const totalStock = films.reduce((acc, f) => acc + f.stock, 0)
  const avgRating = films.length > 0 ? films.reduce((acc, f) => acc + f.rating, 0) / films.length : 0

  const sorted = [...films].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return {
    totalFilms: films.length,
    totalGenres: genreSet.size,
    totalStock,
    avgRating: Math.round(avgRating * 10) / 10,
    recentFilms: sorted.slice(0, 5),
    genreDistribution: Array.from(genreSet).map((genre) => ({
      genre,
      count: films.filter((f) => f.genres.includes(genre)).length,
    })),
  }
}
