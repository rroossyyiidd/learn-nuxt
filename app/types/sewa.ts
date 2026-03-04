export type TSewaItem = {
  filmId: string
  filmTitle: string
  duration: number // in days
  rentalPrice: number
}

export type TSewa = {
  id: string
  pelangganId: string
  pelangganName: string
  items: TSewaItem[]
  totalPrice: number
  status: 'Aktif' | 'Selesai' | 'Terlambat'
  rentalDate: string
  createdAt: string
  updatedAt: string
}

export type TSewaResponse = {
  sewa: TSewa[]
  total: number
}

export type TSewaDetailResponse = {
  sewa: TSewa
}
