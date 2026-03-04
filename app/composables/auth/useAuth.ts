export const useAuth = () => {
  const user = useState<TUser | null>('auth_user', () => null)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (username: string, password: string) => {
    const data = await $fetch<TLoginResponse>('/api/auth/login', {
      method: 'POST',
      body: { username, password },
    })
    user.value = data.user
    return data
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    navigateTo('/login')
  }

  const fetchUser = async () => {
    try {
      // Forward browser cookies during SSR so the server API can read auth_token
      const headers = import.meta.server ? useRequestHeaders(['cookie']) : {}
      const data = await $fetch<TMeResponse>('/api/auth/me', { headers })
      user.value = data.user
    }
    catch {
      user.value = null
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    fetchUser,
  }
}
