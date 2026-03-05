// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module', '@peterbud/nuxt-query'],

  // Must be declared first so the browser registers the correct CSS layer
  // priority order before Vuetify's inline theme stylesheet is injected.
  // Without this, @layer vuetify-utilities (which contains pa-*, px-*, etc.)
  // ends up with lower priority than @layer vuetify-components, breaking
  // utility class padding/margin/etc on Vuetify components.
  css: ['~/assets/vuetify-layer-order.css'],

  nuxtQuery: {
    autoImports: true,
  },

  imports: {
    dirs: ['types', 'composables/**', 'shared/utils/**'],
  },

  runtimeConfig: {
    tmdbToken: process.env.TMDB_TOKEN || '',
    public: {
      tmdbImageBase: 'https://image.tmdb.org/t/p',
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || '',
    },
  },

  app: {
    head: {
      titleTemplate: '%s | CD Rental Admin',
      // This inline style MUST be the very first style in <head> to establish
      // the correct CSS layer cascade order before Vuetify's inline
      // vuetify-theme-stylesheet is injected. Without this, @layer
      // vuetify-utilities (pa-*, px-*, ma-*, etc.) ends up with lower priority
      // than @layer vuetify-components, breaking utility classes on components.
      style: [
        {
          innerHTML: '@layer vuetify-core, vuetify-components, vuetify-overrides, vuetify-utilities, vuetify-final;',
          tagPriority: -10,
        },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap',
        },
      ],
    },
  },

  vuetify: {
    moduleOptions: {
      styles: true,
    },
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi',
      },
      theme: {
        defaultTheme: 'light',
        themes: {
          dark: {
            colors: {
              primary: '#6366F1',
              'on-primary': '#FFFFFF',
              secondary: '#8B5CF6',
              accent: '#F59E0B',
              success: '#10B981',
              warning: '#F59E0B',
              error: '#EF4444',
              info: '#3B82F6',
              background: '#0F172A',
              surface: '#1E293B',
              'surface-variant': '#334155',
              'on-background': '#F1F5F9',
              'on-surface': '#F1F5F9',
            },
          },
          light: {
            colors: {
              primary: '#6366F1',
              'on-primary': '#FFFFFF',
              secondary: '#8B5CF6',
              accent: '#F59E0B',
              success: '#10B981',
              warning: '#F59E0B',
              error: '#EF4444',
              info: '#3B82F6',
              background: '#F8FAFC',
              surface: '#F1F5F9',
              'surface-variant': '#E2E8F0',
              'on-background': '#0F172A',
              'on-surface': '#1E293B',
            },
          },
        },
      },
      defaults: {
        VBtn: { rounded: 'lg' },
        VCard: { rounded: 'lg', elevation: 0 },
        VTextField: { variant: 'outlined', density: 'comfortable', rounded: 'lg' },
        VTextarea: { variant: 'outlined', density: 'comfortable', rounded: 'lg' },
        VSelect: { variant: 'outlined', density: 'comfortable', rounded: 'lg' },
        VDataTable: { hover: true },
      },
    },
  },
})