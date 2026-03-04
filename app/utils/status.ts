export const statusColor = (status: ESewaStatus) => {
  switch (status) {
    case ESewaStatus.AKTIF: return 'info'
    case ESewaStatus.SELESAI: return 'success'
    case ESewaStatus.TERLAMBAT: return 'error'
    default: return 'grey'
  }
}

export const statusIcon = (status: ESewaStatus) => {
  switch (status) {
    case ESewaStatus.AKTIF: return 'mdi-clock-outline'
    case ESewaStatus.SELESAI: return 'mdi-check-circle'
    case ESewaStatus.TERLAMBAT: return 'mdi-alert'
    default: return 'mdi-help-circle'
  }
}
