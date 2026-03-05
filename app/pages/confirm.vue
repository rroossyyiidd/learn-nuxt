<template>
  <NuxtLayout name="auth">
    <v-card class="login-card" elevation="8">
      <div class="login-header pa-6 text-center">
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="white"
          size="48"
          class="mb-3"
        />
        <v-icon v-else :icon="statusIcon" size="48" color="white" class="mb-3" />
        <h1 class="text-h5 font-weight-bold text-white">{{ statusTitle }}</h1>
        <p class="text-body-2 text-white-50 mt-1">{{ statusMessage }}</p>
      </div>

      <v-card-text v-if="error" class="pa-6 text-center">
        <v-alert type="error" variant="tonal" density="compact" rounded="lg" class="mb-4">
          {{ error }}
        </v-alert>
        <v-btn color="primary" variant="flat" rounded="lg" to="/login" class="text-none">
          <v-icon icon="mdi-arrow-left" class="mr-2" />
          Back to Login
        </v-btn>
      </v-card-text>
    </v-card>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

useHead({ title: 'Confirm' })

const { fetchUser } = useAuth()
const { mutateAsync: setOAuthSessionMutation } = useSetOAuthSession()

const loading = ref(true)
const error = ref('')
const statusTitle = ref('Confirming...')
const statusMessage = ref('Please wait while we verify your account')
const statusIcon = ref('mdi-check-circle')

onMounted(async () => {
  try {
    const supabase = useSupabase()

    // Supabase will automatically detect the tokens/code in the URL hash/params
    const { data, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      throw new Error(sessionError.message)
    }

    if (!data.session) {
      // Try exchanging code from URL if present
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')

      if (code) {
        const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          throw new Error(exchangeError.message)
        }

        if (!exchangeData.session) {
          throw new Error('Failed to establish session')
        }

        // Use the exchanged session
        await handleOAuthSession(exchangeData.session.user)
      }
      else {
        throw new Error('No authentication session found')
      }
    }
    else {
      await handleOAuthSession(data.session.user)
    }
  }
  catch (err: unknown) {
    const e = err as Error
    error.value = e.message || 'Authentication failed'
    statusTitle.value = 'Authentication Failed'
    statusMessage.value = 'Something went wrong during sign in'
    statusIcon.value = 'mdi-alert-circle'
    loading.value = false
  }
})

async function handleOAuthSession(user: { user_metadata?: { full_name?: string; name?: string; preferred_username?: string; avatar_url?: string }; email?: string }) {
  const name = user.user_metadata?.full_name
    || user.user_metadata?.name
    || user.user_metadata?.preferred_username
    || 'OAuth User'
  const email = user.email || ''

  // Call server endpoint to set the httpOnly auth cookie
  await setOAuthSessionMutation({ name, email })

  // Fetch user info into the auth state
  await fetchUser()

  statusTitle.value = 'Success!'
  statusMessage.value = 'Redirecting to dashboard...'
  statusIcon.value = 'mdi-check-circle'
  loading.value = false

  // Redirect to home
  setTimeout(() => {
    window.location.replace('/')
  }, 500)
}
</script>

<style scoped>
.login-card {
  overflow: hidden;
  border: 1px solid rgba(99, 102, 241, 0.2);
  background: rgb(var(--v-theme-surface));
}

.login-header {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%);
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.7) !important;
}
</style>
