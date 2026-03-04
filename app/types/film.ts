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

export type TCatalogResponse = {
  films: TFilm[]
  total: number
}

export type TFilmResponse = {
  film: TFilm
}

export type TGenreDistribution = {
  genre: string
  count: number
}

export type TCatalogStats = {
  totalFilms: number
  totalGenres: number
  totalStock: number
  avgRating: number
  recentFilms: TFilm[]
  genreDistribution: TGenreDistribution[]
}
