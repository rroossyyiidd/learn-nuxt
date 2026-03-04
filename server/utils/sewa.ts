export type TSewaItem = {
  filmId: string
  filmTitle: string
  duration: number
  rentalPrice: number
}

export type TSewa = {
  id: string
  pelangganId: string
  pelangganName: string
  items: TSewaItem[]
  totalPrice: number
  status: ESewaStatus
  rentalDate: string
  createdAt: string
  updatedAt: string
}

// In-memory storage
const sewaList: TSewa[] = [
  {
    id: '1',
    pelangganId: '1',
    pelangganName: 'Rama Hartono',
    items: [
      { filmId: '1', filmTitle: 'Inception', duration: 3, rentalPrice: 45000 },
      { filmId: '2', filmTitle: 'The Dark Knight', duration: 2, rentalPrice: 30000 },
    ],
    totalPrice: 75000,
    status: ESewaStatus.AKTIF,
    rentalDate: '2026-03-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    pelangganId: '2',
    pelangganName: 'Siti Cahyani',
    items: [
      { filmId: '3', filmTitle: 'Interstellar', duration: 5, rentalPrice: 75000 },
    ],
    totalPrice: 75000,
    status: ESewaStatus.SELESAI,
    rentalDate: '2026-02-20',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

let nextId = 3

export function getSewaList(): TSewa[] {
  return sewaList
}

export function getSewaById(id: string): TSewa | undefined {
  return sewaList.find((s) => s.id === id)
}

export function addSewa(data: Omit<TSewa, 'id' | 'createdAt' | 'updatedAt'>): TSewa {
  const sewa: TSewa = {
    ...data,
    id: String(nextId++),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  sewaList.push(sewa)
  return sewa
}

export function updateSewa(id: string, data: Partial<Omit<TSewa, 'id' | 'createdAt' | 'updatedAt'>>): TSewa | null {
  const index = sewaList.findIndex((s) => s.id === id)
  if (index === -1) return null
  sewaList[index] = {
    ...sewaList[index]!,
    ...data,
    updatedAt: new Date().toISOString(),
  }
  return sewaList[index] ?? null
}

export function deleteSewa(id: string): boolean {
  const index = sewaList.findIndex((s) => s.id === id)
  if (index === -1) return false
  sewaList.splice(index, 1)
  return true
}
