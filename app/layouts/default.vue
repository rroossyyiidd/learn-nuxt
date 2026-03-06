<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      class="sidebar-drawer"
      color="surface"
    >
      <!-- Logo / branding -->
      <template #prepend>
        <div class="d-flex align-center pa-2" style="min-height: 64px">
          <v-icon
            icon="mdi-disc"
            size="32"
            color="primary"
            class="mr-3"
          />
          <Transition name="fade">
            <div v-if="!rail">
              <div class="text-h6 font-weight-bold" style="line-height: 1.2">
                CD Rental
              </div>
              <div class="text-caption text-medium-emphasis">
                Admin Panel
              </div>
            </div>
          </Transition>
        </div>
        <v-divider />
      </template>

      <v-list nav density="compact" class="pa-2">
        <v-list-item
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          rounded="lg"
          class="mb-1"
          active-class="active-menu-item"
        />
      </v-list>

      <template #append>
        <v-divider />
        <div class="pa-2">
          <v-list-item
            :prepend-icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            title="Collapse"
            rounded="lg"
            @click="rail = !rail"
          />
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App bar -->
    <v-app-bar flat color="surface" border="b">
      <v-app-bar-nav-icon
        class="d-md-none"
        @click="drawer = !drawer"
      />

      <v-app-bar-title class="text-h6 font-weight-medium">
        {{ pageTitle }}
      </v-app-bar-title>

      <v-spacer />

      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="tonal"
            color="primary"
            rounded="pill"
            class="text-none mr-2"
          >
            <v-avatar size="28" color="primary" class="mr-2">
              <v-icon icon="mdi-account" size="18" />
            </v-avatar>
            <span class="d-none d-sm-inline">{{ user?.name || 'Admin' }}</span>
            <v-icon icon="mdi-chevron-down" size="18" class="ml-1" />
          </v-btn>
        </template>
        <v-list density="compact" min-width="200">
          <v-list-item
            prepend-icon="mdi-account-circle"
            title="Profile"
          />
          <v-divider />
          <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            @click="logout"
          />
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="main-content">
      <v-container fluid class="pa-4 pa-md-6">
        <slot />
      </v-container>
    </v-main>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      location="top right"
      rounded="lg"
    >
      {{ snackbarText }}
      <template #actions>
        <v-btn variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const route = useRoute()

const drawer = ref(true)
const rail = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const menuItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
  { title: 'Film Catalog', icon: 'mdi-filmstrip-box-multiple', to: '/catalog' },
  { title: 'Pelanggan', icon: 'mdi-account-group', to: '/customers' },
  { title: 'Data Sewa', icon: 'mdi-clipboard-text-clock', to: '/rentals' },
]

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/') return 'Dashboard'
  if (path === '/catalog') return 'Film Catalog'
  if (path === '/catalog/add') return 'Add Film'
  if (path.startsWith('/catalog/')) return 'Edit Film'
  if (path === '/customers') return 'Data Pelanggan'
  if (path === '/customers/add') return 'Tambah Pelanggan'
  if (path.startsWith('/customers/')) return 'Edit Pelanggan'
  if (path === '/rentals') return 'Data Sewa'
  if (path === '/rentals/add') return 'Tambah Sewa'
  if (path.startsWith('/rentals/')) return 'Edit Sewa'
  return 'CD Rental Admin'
})

// Provide snackbar functions
const showSnackbar = (text: string, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

provide('showSnackbar', showSnackbar)
</script>

<style scoped>
.sidebar-drawer {
  border-right: 1px solid rgba(255, 255, 255, 0.06) !important;
}

.active-menu-item {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%) !important;
  color: white !important;
}

.main-content {
  background: rgb(var(--v-theme-background));
  min-height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
