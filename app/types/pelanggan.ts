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

export type TPelangganResponse = {
  pelanggan: TPelanggan[]
  total: number
}
