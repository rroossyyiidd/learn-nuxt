<template>
  <div>
    <!-- Header -->
    <PageHeader
      title="Add New Film"
      subtitle="Add a film to your rental catalog"
      back-to="/catalog"
    />

    <!-- TMDB Search card -->
    <v-card class="mb-6">
      <v-card-text class="pa-5">
        <div class="d-flex align-center mb-3">
          <v-icon icon="mdi-movie-search" class="mr-2" color="secondary" />
          <span class="text-subtitle-1 font-weight-medium">Quick Fill from TMDB</span>
        </div>
        <v-autocomplete
          v-model="selectedTmdbMovie"
          v-model:search="tmdbSearchQuery"
          :items="tmdbMovieOptions"
          :loading="isTmdbLoading"
          item-title="label"
          item-value="id"
          return-object
          placeholder="Search a movie on TMDB to auto-fill the form..."
          prepend-inner-icon="mdi-magnify"
          hide-details
          clearable
          no-filter
          :no-data-text="tmdbSearchQuery ? 'No movies found' : 'Type to search movies...'"
          @update:model-value="fillFromTmdb"
        >
          <template #item="{ item, props: itemProps }">
            <v-list-item
              v-bind="itemProps"
              :prepend-avatar="item.poster ? `${tmdbImageBase}/w92${item.poster}` : undefined"
            >
              <template #subtitle>
                <span>{{ item.year }} · ⭐ {{ item.rating }}</span>
              </template>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-card-text>
    </v-card>

    <!-- Form -->
    <v-card>
      <v-card-text class="pa-5 pa-md-8">
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-row>
            <!-- Left column: poster preview -->
            <v-col cols="12" md="4" lg="3">
              <div class="poster-preview mb-4">
                <v-img
                  v-if="form.posterPath"
                  :src="`${tmdbImageBase}/w300${form.posterPath}`"
                  aspect-ratio="2/3"
                  cover
                  rounded="lg"
                  class="poster-img"
                >
                  <template #error>
                    <div class="d-flex align-center justify-center fill-height bg-surface-variant rounded-lg">
                      <v-icon icon="mdi-image-broken" size="48" />
                    </div>
                  </template>
                </v-img>
                <div
                  v-else
                  class="d-flex align-center justify-center bg-surface-variant rounded-lg"
                  style="aspect-ratio: 2/3"
                >
                  <div class="text-center">
                    <v-icon icon="mdi-image-plus" size="48" color="medium-emphasis" class="mb-2" />
                    <p class="text-caption text-medium-emphasis">
                      Search TMDB to load poster
                    </p>
                  </div>
                </div>
              </div>

              <!-- Rating display -->
              <v-card variant="tonal" color="primary" class="text-center pa-4" rounded="lg">
                <div class="text-h3 font-weight-bold">
                  {{ form.rating || '0' }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  TMDB Rating
                </div>
              </v-card>
            </v-col>

            <!-- Right columns: form fields -->
            <v-col cols="12" md="8" lg="9">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.title"
                    label="Film Title *"
                    prepend-inner-icon="mdi-movie"
                    :error-messages="fieldErrors.title"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="form.overview"
                    label="Overview / Synopsis *"
                    prepend-inner-icon="mdi-text"
                    rows="3"
                    :error-messages="fieldErrors.overview"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="form.releaseDate"
                    label="Release Date *"
                    type="date"
                    prepend-inner-icon="mdi-calendar"
                    :error-messages="fieldErrors.releaseDate"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="form.rating"
                    label="Rating (0-10)"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    prepend-inner-icon="mdi-star"
                    :error-messages="fieldErrors.rating"
                  />
                </v-col>

                <v-col cols="12">
                  <v-combobox
                    v-model="form.genres"
                    :items="availableGenres"
                    label="Genres *"
                    multiple
                    chips
                    closable-chips
                    prepend-inner-icon="mdi-tag-multiple"
                    :error-messages="fieldErrors.genres"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="form.stock"
                    label="Stock Quantity *"
                    type="number"
                    min="0"
                    prepend-inner-icon="mdi-package-variant"
                    :error-messages="fieldErrors.stock"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="form.rentalPrice"
                    label="Rental Price (Rp) *"
                    type="number"
                    min="0"
                    prefix="Rp"
                    prepend-inner-icon="mdi-cash"
                    :error-messages="fieldErrors.rentalPrice"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <!-- Action buttons -->
          <FormActions
            cancel-to="/catalog"
            submit-text="Save Film"
            :loading="isSubmitting"
          />
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const tmdbImageBase = config.public.tmdbImageBase
const showSnackbar = inject<(text: string, color?: string) => void>('showSnackbar')

const selectedTmdbMovie = ref<TTmdbMovieOption | null>(null)

const { tmdbSearchQuery, isTmdbLoading, tmdbMovieOptions } = useTmdbSearch('tmdb-search-form')
const { genreMap } = useTmdbGenres()

// Mutation
const { mutateAsync: addCatalog, isPending: isSubmitting } = useAddCatalog()

const form = reactive({
  title: '',
  overview: '',
  releaseDate: '',
  genres: [] as string[],
  rating: 0,
  stock: 1,
  rentalPrice: 15000,
  posterPath: null as string | null,
  backdropPath: null as string | null,
  tmdbId: null as number | null,
})

const fieldErrors = reactive<Record<string, string | string[]>>({
  title: '',
  overview: '',
  releaseDate: '',
  genres: '',
  rating: '',
  stock: '',
  rentalPrice: '',
})

const availableGenres = Object.values(EAvailableGenre)

const fillFromTmdb = (movie: TTmdbMovieOption | null) => {
  if (!movie) return
  form.title = movie.title
  form.overview = movie.overview || ''
  form.posterPath = movie.poster_path
  form.backdropPath = movie.backdrop_path
  form.releaseDate = movie.release_date || ''
  form.rating = movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : 0
  form.tmdbId = movie.id
  form.genres = (movie.genre_ids || []).map((id: number) => genreMap.value[id] || 'Unknown').filter((g: string) => g !== 'Unknown')
}

const handleSubmit = async () => {
  // Reset errors
  Object.keys(fieldErrors).forEach((key) => { fieldErrors[key] = '' })

  const result = filmSchema.safeParse(form)
  if (!result.success) {
    const flat = result.error.flatten()
    Object.entries(flat.fieldErrors).forEach(([key, msgs]) => {
      if (msgs && msgs.length > 0) {
        fieldErrors[key] = msgs[0] ?? ''
      }
    })
    return
  }

  try {
    await addCatalog(result.data as Record<string, unknown>)
    showSnackbar?.('Film added successfully!')
    navigateTo('/catalog')
  }
  catch (err: unknown) {
    const fetchErr = err as { data?: { statusMessage?: string } }
    showSnackbar?.(fetchErr?.data?.statusMessage || 'Failed to add film', 'error')
  }
}
</script>

<style scoped>
.poster-preview {
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

.poster-img {
  border: none;
}

</style>
