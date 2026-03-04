export default defineNuxtPlugin((nuxtApp) => {
  // Wait for Vuetify to be available, then restore theme
  nuxtApp.hook('app:created', () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('theme-preference')
      const theme = (saved === 'dark' || saved === 'light') ? saved : 'light'
      const vuetify = nuxtApp.$vuetify as { theme?: { global: { name: { value: string } } } }
      if (vuetify?.theme) {
        vuetify.theme.global.name.value = theme
      }
    }
  })
})
