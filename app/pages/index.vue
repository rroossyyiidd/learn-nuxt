<template>
  <div>
    <!-- Welcome banner -->
    <v-card class="mb-6 welcome-card" color="transparent" flat>
      <v-card-text class="pa-6">
        <v-row align="center">
          <v-col cols="12" md="8">
            <h1 class="text-h4 font-weight-bold mb-2">
              Welcome back, {{ user?.name || 'Admin' }} 👋
            </h1>
            <p class="text-body-1 text-medium-emphasis mb-0">
              Here's what's happening with your CD rental catalog today.
            </p>
          </v-col>
          <v-col cols="12" md="4" class="text-md-right">
            <v-btn
              color="primary"
              size="large"
              class="text-none gradient-btn text-none"
              to="/catalog/add"
            >
              <v-icon icon="mdi-plus" class="mr-2" />
              Add New Film
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Stats cards -->
    <v-row class="mb-6">
      <v-col
        v-for="stat in statsCards"
        :key="stat.title"
        cols="12"
        sm="6"
        lg="3"
      >
        <v-card class="stat-card" :style="{ borderTop: `3px solid ${stat.color}` }">
          <v-card-text class="pa-5">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="text-caption text-medium-emphasis mb-1 text-uppercase font-weight-medium" style="letter-spacing: 0.08em">
                  {{ stat.title }}
                </p>
                <h2 class="text-h4 font-weight-bold">
                  {{ stat.value }}
                </h2>
              </div>
              <v-avatar :color="stat.color" variant="tonal" size="48" rounded="lg">
                <v-icon :icon="stat.icon" size="24" />
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts row -->
    <v-row>
      <!-- Genre distribution -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="d-flex align-center pa-5 pb-2">
            <v-icon icon="mdi-chart-pie" class="mr-2" color="primary" />
            Genre Distribution
          </v-card-title>
          <v-card-text class="pa-5 pt-2">
            <div v-if="stats?.genreDistribution?.length">
              <div
                v-for="genre in stats.genreDistribution"
                :key="genre.genre"
                class="mb-3"
              >
                <div class="d-flex justify-space-between mb-1">
                  <span class="text-body-2">{{ genre.genre }}</span>
                  <span class="text-body-2 font-weight-bold">{{ genre.count }}</span>
                </div>
                <v-progress-linear
                  :model-value="(genre.count / (stats?.totalFilms || 1)) * 100"
                  :color="genreColors[genre.genre] || 'primary'"
                  height="8"
                  rounded
                />
              </div>
            </div>
            <div v-else class="text-center py-8 text-medium-emphasis">
              <v-icon icon="mdi-chart-pie" size="48" class="mb-2" />
              <p>No data available</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Recent films -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between pa-5 pb-2">
            <div class="d-flex align-center">
              <v-avatar color="secondary" variant="tonal" size="36" rounded="lg" class="mr-3">
                <v-icon icon="mdi-clock-outline" size="20" />
              </v-avatar>
              <span>Recent Films</span>
            </div>
            <v-btn
              variant="text"
              color="secondary"
              size="small"
              class="text-none"
              to="/catalog"
              append-icon="mdi-arrow-right"
            >
              View All
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-5 pt-2">
            <div v-if="stats?.recentFilms?.length" class="d-flex flex-column" style="gap: 10px">
              <v-card
                v-for="(film, index) in stats.recentFilms"
                :key="film.id"
                :to="`/catalog/${film.id}`"
                variant="tonal"
                class="film-item-card"
              >
                <div class="d-flex align-center pa-3" style="gap: 14px">
                  <!-- Rank number -->
                  <div class="film-rank">
                    {{ Number(index) + 1 }}
                  </div>

                  <!-- Poster -->
                  <v-avatar size="56" rounded="lg" class="film-poster">
                    <v-img
                      v-if="film.posterPath"
                      :src="`${tmdbImageBase}/w92${film.posterPath}`"
                      :alt="film.title"
                      cover
                    />
                    <v-icon v-else icon="mdi-filmstrip" size="28" color="secondary" />
                  </v-avatar>

                  <!-- Info -->
                  <div class="flex-grow-1" style="min-width: 0">
                    <p class="text-body-1 font-weight-semibold mb-1 text-truncate">
                      {{ film.title }}
                    </p>
                    <div class="d-flex align-center" style="gap: 6px">
                      <v-chip
                        size="x-small"
                        variant="tonal"
                        color="warning"
                        label
                      >
                        <v-icon icon="mdi-star" size="10" class="mr-1" />
                        {{ film.rating }}
                      </v-chip>
                      <v-chip
                        size="x-small"
                        variant="tonal"
                        :color="film.stock > 3 ? 'success' : (film.stock > 0 ? 'warning' : 'error')"
                        label
                      >
                        <v-icon icon="mdi-package-variant" size="10" class="mr-1" />
                        {{ film.stock }}
                      </v-chip>
                    </div>
                  </div>

                  <!-- Arrow -->
                  <v-icon icon="mdi-chevron-right" size="20" color="medium-emphasis" />
                </div>
              </v-card>
            </div>
            <div v-else class="text-center py-8 text-medium-emphasis">
              <v-icon icon="mdi-filmstrip-off" size="48" class="mb-2 d-block mx-auto" />
              <p class="text-body-2">No films added yet</p>
              <v-btn
                variant="tonal"
                color="secondary"
                size="small"
                class="text-none mt-3"
                to="/catalog/add"
              >
                Add Your First Film
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth()
const config = useRuntimeConfig()
const tmdbImageBase = config.public.tmdbImageBase

const { data: stats } = useCatalogStats()

const statsCards = computed(() => [
  {
    title: 'Total Films',
    value: stats.value?.totalFilms ?? 0,
    icon: 'mdi-filmstrip-box-multiple',
    color: '#6366F1',
  },
  {
    title: 'Genres',
    value: stats.value?.totalGenres ?? 0,
    icon: 'mdi-tag-multiple',
    color: '#8B5CF6',
  },
  {
    title: 'Total Stock',
    value: stats.value?.totalStock ?? 0,
    icon: 'mdi-package-variant',
    color: '#10B981',
  },
  {
    title: 'Avg. Rating',
    value: stats.value?.avgRating ?? 0,
    icon: 'mdi-star',
    color: '#F59E0B',
  },
])

const genreColors: Record<string, string> = {
  'Action': '#EF4444',
  'Adventure': '#F59E0B',
  'Comedy': '#10B981',
  'Crime': '#6366F1',
  'Drama': '#8B5CF6',
  'Horror': '#DC2626',
  'Romance': '#EC4899',
  'Sci-Fi': '#3B82F6',
  'Thriller': '#14B8A6',
  'Animation': '#F97316',
  'Documentary': '#6B7280',
  'Fantasy': '#A855F7',
}
</script>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 16px;
}

.stat-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.gradient-btn {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%) !important;
  color: white !important;
}

.film-item-card {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

.film-item-card:hover {
  transform: translateX(4px);
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.15);
}

.film-rank {
  width: 28px;
  height: 28px;
  min-width: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: white;
}

.film-poster {
  border: 2px solid rgba(139, 92, 246, 0.2);
  overflow: hidden;
}
</style>
