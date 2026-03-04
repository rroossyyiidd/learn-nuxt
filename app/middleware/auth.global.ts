export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login' || to.path === '/confirm') return

  const { isAuthenticated, fetchUser } = useAuth()

  // Only fetch user on client-side navigation or initial SSR
  if (!isAuthenticated.value) {
    try {
      await fetchUser()
    }
    catch {
      // Ignore fetch errors
    }
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
