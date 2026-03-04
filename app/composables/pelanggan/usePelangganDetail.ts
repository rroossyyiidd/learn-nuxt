export const usePelangganDetail = (pelangganId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['pelanggan-detail', pelangganId],
    queryFn: () => $fetch<TPelangganDetailResponse>(`/api/pelanggan/${pelangganId}`),
  })

  return { data, isLoading, error }
}
