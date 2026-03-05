import { useQuery } from '#imports'
import type { TSewaResponse } from '../-types/sewa'

export const useSewa = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['sewa'],
    queryFn: () => $fetch<TSewaResponse>('/api/sewa'),
  })

  return { data, isLoading }
}
