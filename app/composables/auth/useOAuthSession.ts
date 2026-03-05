export const useSetOAuthSession = () => {
  return useMutation({
    mutationFn: (params: { name: string, email: string }) =>
      $fetch('/api/auth/oauth-session', { params }),
  })
}
