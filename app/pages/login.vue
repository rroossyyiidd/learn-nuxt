<template>
  <NuxtLayout name="auth">
    <v-card class="login-card" elevation="8">
      <!-- Gradient header -->
      <div class="login-header pa-6 text-center">
        <v-icon icon="mdi-disc" size="48" color="white" class="mb-3" />
        <h1 class="text-h5 font-weight-bold text-white">CD Rental Admin</h1>
        <p class="text-body-2 text-white-50 mt-1">
          Sign in to manage your rental catalog
        </p>
      </div>

      <v-card-text class="pa-6">
        <v-form ref="formRef" @submit.prevent="handleLogin">
          <v-text-field
            v-model="form.username"
            label="Username"
            prepend-inner-icon="mdi-account"
            :error-messages="errors.username"
            autofocus
            class="mb-2"
          />

          <v-text-field
            v-model="form.password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :error-messages="errors.password"
            class="mb-2"
            @click:append-inner="showPassword = !showPassword"
          />

          <v-alert
            v-if="loginError"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-4"
            rounded="lg"
          >
            {{ loginError }}
          </v-alert>

          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            :loading="loading"
            class="gradient-btn text-none font-weight-bold"
          >
            <v-icon icon="mdi-login" class="mr-2" />
            Sign In
          </v-btn>
        </v-form>

        <div class="text-center mt-4">
          <v-chip size="small" variant="tonal" color="info">
            <v-icon icon="mdi-information" start />
            Demo: admin / admin123
          </v-chip>
        </div>
      </v-card-text>
    </v-card>
  </NuxtLayout>
</template>

<script setup lang="ts">


definePageMeta({
  layout: false,
})

const { login } = useAuth()

const form = reactive({
  username: '',
  password: '',
})

const errors = reactive({
  username: '' as string | string[],
  password: '' as string | string[],
})

const showPassword = ref(false)
const loading = ref(false)
const loginError = ref('')

const handleLogin = async () => {
  // Reset errors
  errors.username = ''
  errors.password = ''
  loginError.value = ''

  // Validate with Zod
  const result = loginSchema.safeParse(form)
  if (!result.success) {
    const flat = result.error.flatten()
    errors.username = flat.fieldErrors.username?.[0] || ''
    errors.password = flat.fieldErrors.password?.[0] || ''
    return
  }

  loading.value = true
  try {
    await login(form.username, form.password)
    // Hard redirect so SSR can read the auth cookie and middleware allows access
    window.location.replace('/')
  }
  catch (err: unknown) {
    const fetchErr = err as { data?: { statusMessage?: string }; statusMessage?: string }
    loginError.value = fetchErr?.data?.statusMessage || fetchErr?.statusMessage || 'Login failed. Please try again.'
  }
  finally {
    loading.value = false
  }
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

.gradient-btn {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%) !important;
  transition: all 0.3s ease;
}

.gradient-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
}
</style>
