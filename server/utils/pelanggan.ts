export type TPelanggan = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  membershipType: 'Silver' | 'Gold' | 'Platinum'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// In-memory storage
const pelangganList: TPelanggan[] = [
  {
    id: '1',
    name: 'Rama Hartono',
    email: 'rama@example.com',
    phone: '081234567890',
    address: 'Jl. Merdeka No. 10, Jakarta',
    membershipType: 'Gold',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Siti Cahyani',
    email: 'siti@example.com',
    phone: '082345678901',
    address: 'Jl. Sudirman No. 25, Bandung',
    membershipType: 'Platinum',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Andi Wijaya',
    email: 'andi@example.com',
    phone: '083456789012',
    address: 'Jl. Diponegoro No. 5, Surabaya',
    membershipType: 'Silver',
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

let nextId = 4

export function getPelangganList(): TPelanggan[] {
  return pelangganList
}

export function getPelangganById(id: string): TPelanggan | undefined {
  return pelangganList.find((p) => p.id === id)
}

export function addPelanggan(data: Omit<TPelanggan, 'id' | 'createdAt' | 'updatedAt'>): TPelanggan {
  const pelanggan: TPelanggan = {
    ...data,
    id: String(nextId++),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  pelangganList.push(pelanggan)
  return pelanggan
}

export function updatePelanggan(id: string, data: Partial<Omit<TPelanggan, 'id' | 'createdAt' | 'updatedAt'>>): TPelanggan | null {
  const index = pelangganList.findIndex((p) => p.id === id)
  if (index === -1) return null
  pelangganList[index] = {
    ...pelangganList[index]!,
    ...data,
    updatedAt: new Date().toISOString(),
  }
  return pelangganList[index] ?? null
}

export function deletePelanggan(id: string): boolean {
  const index = pelangganList.findIndex((p) => p.id === id)
  if (index === -1) return false
  pelangganList.splice(index, 1)
  return true
}
