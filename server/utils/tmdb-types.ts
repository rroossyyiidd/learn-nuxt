export type TTmdbMovie = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
  vote_count: number
}

export type TTmdbSearchResponse = {
  page: number
  results: TTmdbMovie[]
  total_pages: number
  total_results: number
}

export type TTmdbGenre = {
  id: number
  name: string
}

export type TTmdbGenresResponse = {
  genres: TTmdbGenre[]
}

export type TTmdbMovieDetail = TTmdbMovie & {
  budget: number
  revenue: number
  runtime: number
  status: string
  tagline: string
  genres: TTmdbGenre[]
  homepage: string
  imdb_id: string
}
