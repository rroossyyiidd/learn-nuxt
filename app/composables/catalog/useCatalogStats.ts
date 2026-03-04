export const useCatalogStats = () => {
  const { data } = useQuery({
    queryKey: ['catalog-stats'],
    queryFn: () => $fetch<TCatalogStats>('/api/catalog/stats'),
  })

  return { data }
}
