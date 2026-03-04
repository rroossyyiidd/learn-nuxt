export const useCatalog = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['catalog'],
    queryFn: () => $fetch<TCatalogResponse>('/api/catalog'),
  })

  return { data, isLoading }
}
