import { useQuery } from '#imports'
import type { TSewaDetailResponse } from '../-types/sewa'

export const useSewaDetail = (sewaId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['sewa-detail', sewaId],
    queryFn: () => $fetch<TSewaDetailResponse>(`/api/sewa/${sewaId}`),
  })

  return { data, isLoading, error }
}
