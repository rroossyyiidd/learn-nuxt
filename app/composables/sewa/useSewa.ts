export const useSewa = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['sewa'],
    queryFn: () => $fetch<TSewaResponse>('/api/sewa'),
  })

  return { data, isLoading }
}
