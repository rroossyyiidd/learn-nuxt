import { z } from 'zod'

export const filmSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  overview: z.string().min(1, 'Overview is required'),
  releaseDate: z.string().min(1, 'Release date is required'),
  genres: z.array(z.string()).min(1, 'At least one genre is required'),
  rating: z.number({ error: 'Rating must be a number' }).min(0, 'Min 0').max(10, 'Max 10'),
  stock: z.number({ error: 'Stock must be a number' }).int('Must be whole number').min(0, 'Min 0'),
  rentalPrice: z.number({ error: 'Price must be a number' }).min(0, 'Min 0'),
  posterPath: z.string().nullable().optional(),
  backdropPath: z.string().nullable().optional(),
  tmdbId: z.number().nullable().optional(),
})

export const updateFilmSchema = filmSchema.partial()

export const pelangganSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  membershipType: z.enum(['Silver', 'Gold', 'Platinum'], { error: 'Membership type is required' }),
  isActive: z.boolean().default(true),
})

export const updatePelangganSchema = pelangganSchema.partial()

export const sewaItemSchema = z.object({
  filmId: z.string().min(1, 'Film is required'),
  filmTitle: z.string().min(1, 'Film title is required'),
  duration: z.number({ error: 'Duration must be a number' }).int('Must be whole number').min(1, 'Min 1 day'),
  rentalPrice: z.number({ error: 'Price must be a number' }).min(0, 'Min 0'),
})

export const sewaSchema = z.object({
  pelangganId: z.string().min(1, 'Pelanggan is required'),
  pelangganName: z.string().min(1, 'Pelanggan name is required'),
  items: z.array(sewaItemSchema).min(1, 'At least one film is required'),
  totalPrice: z.number().min(0, 'Min 0'),
  status: z.enum(['Aktif', 'Selesai', 'Terlambat']).default('Aktif'),
  rentalDate: z.string().min(1, 'Rental date is required'),
})

export const updateSewaSchema = sewaSchema.partial()

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})
