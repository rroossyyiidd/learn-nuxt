<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="48" />
      <p class="text-body-1 mt-4 text-medium-emphasis">
        Loading film data...
      </p>
    </div>

    <!-- Error state -->
    <v-alert v-else-if="error" type="error" variant="tonal" class="mb-6">
      Film not found. <NuxtLink to="/catalog">
        Go back to catalog
      </NuxtLink>
    </v-alert>

    <!-- Content -->
    <template v-else-if="filmData?.film">
      <!-- Header -->
      <div class="d-flex align-center mb-6">
        <v-btn
          icon="mdi-arrow-left"
          variant="text"
          class="mr-3"
          to="/catalog"
        />
        <div>
          <h1 class="text-h5 font-weight-bold">
            Edit Film
          </h1>
          <p class="text-body-2 text-medium-emphasis">
            Update "{{ filmData.film.title }}"
          </p>
        </div>
      </div>

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
                    <v-icon icon="mdi-image" size="48" color="medium-emphasis" />
                  </div>
                </div>

                <!-- Rating display -->
                <v-card variant="tonal" color="primary" class="text-center pa-4" rounded="lg">
                  <div class="text-h3 font-weight-bold">
                    {{ form.rating || '0' }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    Rating
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
            <v-divider class="my-6" />
            <div class="d-flex justify-end ga-3 mt-4">
              <v-btn
                variant="text"
                size="large"
                class="text-none px-8"
                to="/catalog"
              >
                Cancel
              </v-btn>
              <v-btn
                type="submit"
                color="primary"
                size="large"
                class="text-none text-white gradient-btn px-8"
                style="color: #fff !important"
                :loading="isSubmitting"
              >
                <v-icon icon="mdi-content-save" class="mr-2" />
                Update Film
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const tmdbImageBase = config.public.tmdbImageBase
const showSnackbar = inject<(text: string, color?: string) => void>('showSnackbar')
const queryClient = useQueryClient()

const filmId = route.params.id as string
const isSubmitting = ref(false)

// Fetch film data
const { data: filmData, isLoading, error } = useCatalogFilm(filmId)

const form = reactive({
  title: '',
  overview: '',
  releaseDate: '',
  genres: [] as string[],
  rating: 0,
  stock: 0,
  rentalPrice: 0,
  posterPath: null as string | null,
  backdropPath: null as string | null,
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

// Populate form when data loads
watch(() => filmData.value, (data) => {
  if (data?.film) {
    form.title = data.film.title
    form.overview = data.film.overview
    form.releaseDate = data.film.releaseDate
    form.genres = [...data.film.genres]
    form.rating = data.film.rating
    form.stock = data.film.stock
    form.rentalPrice = data.film.rentalPrice
    form.posterPath = data.film.posterPath
    form.backdropPath = data.film.backdropPath
  }
}, { immediate: true })

const availableGenres = Object.values(EAvailableGenre)

const handleSubmit = async () => {
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

  isSubmitting.value = true
  try {
    await $fetch<TFilmResponse>(`/api/catalog/${filmId}`, {
      method: 'PUT',
      body: result.data,
    })
    showSnackbar?.('Film updated successfully!')
    queryClient.invalidateQueries({ queryKey: ['catalog'] })
    queryClient.invalidateQueries({ queryKey: ['catalog-stats'] })
    navigateTo('/catalog')
  }
  catch (err: unknown) {
    const fetchErr = err as { data?: { statusMessage?: string } }
    showSnackbar?.(fetchErr?.data?.statusMessage || 'Failed to update film', 'error')
  }
  finally {
    isSubmitting.value = false
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

.gradient-btn {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%) !important;
}
</style>
