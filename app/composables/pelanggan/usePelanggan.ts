export const usePelanggan = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['pelanggan'],
    queryFn: () => $fetch<TPelangganResponse>('/api/pelanggan'),
  })

  return { data, isLoading }
}
