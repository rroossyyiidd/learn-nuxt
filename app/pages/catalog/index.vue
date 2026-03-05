<template>
  <div>
    <!-- Header -->
    <PageListHeader title="Film Catalog" subtitle="Manage your CD rental film collection">
      <div class="d-flex ga-2">
        <v-btn
          color="secondary"
          variant="tonal"
          class="text-none"
          @click="tmdbDialog = true"
        >
          <v-icon icon="mdi-database-search" class="mr-2" />
          Import from TMDB
        </v-btn>
        <v-btn
          color="primary"
          class="text-none gradient-btn"
          to="/catalog/add"
        >
          <v-icon icon="mdi-plus" class="mr-2" />
          Add Film
        </v-btn>
      </div>
    </PageListHeader>

    <!-- Search and filters -->
    <v-card class="mb-6">
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              placeholder="Search films..."
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedGenre"
              :items="allGenres"
              label="Filter by Genre"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" md="3" class="d-flex align-center">
            <v-btn-toggle v-model="viewMode" mandatory density="comfortable" rounded="lg">
              <v-btn value="table" icon="mdi-table" />
              <v-btn value="grid" icon="mdi-view-grid" />
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Table view -->
    <v-card v-if="viewMode === 'table'">
      <v-data-table
        :headers="headers"
        :items="filteredFilms"
        :loading="isLoading"
        :items-per-page="10"
        class="film-table"
      >
        <template #item.poster="{ item }">
          <v-avatar size="40" rounded="lg" class="my-1">
            <v-img
              v-if="item.posterPath"
              :src="`${tmdbImageBase}/w92${item.posterPath}`"
              :alt="item.title"
              cover
            />
            <v-icon v-else icon="mdi-filmstrip" />
          </v-avatar>
        </template>

        <template #item.title="{ item }">
          <div class="font-weight-medium">
            {{ item.title }}
          </div>
        </template>

        <template #item.genres="{ item }">
          <div class="d-flex flex-wrap ga-1">
            <v-chip
              v-for="genre in item.genres.slice(0, 2)"
              :key="genre"
              size="x-small"
              variant="tonal"
              color="primary"
            >
              {{ genre }}
            </v-chip>
            <v-chip v-if="item.genres.length > 2" size="x-small" variant="tonal">
              +{{ item.genres.length - 2 }}
            </v-chip>
          </div>
        </template>

        <template #item.rating="{ item }">
          <v-chip size="small" variant="tonal" color="accent">
            ⭐ {{ item.rating }}
          </v-chip>
        </template>

        <template #item.rentalPrice="{ item }">
          <span class="font-weight-medium">
            Rp {{ item.rentalPrice.toLocaleString('id-ID') }}
          </span>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex ga-1">
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              color="info"
              :to="`/catalog/${item.id}`"
            />
            <v-btn
              icon="mdi-delete"
              variant="text"
              size="small"
              color="error"
              @click="confirmDelete(item)"
            />
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Grid view -->
    <v-row v-else>
      <v-col
        v-for="film in filteredFilms"
        :key="film.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="film-card h-100 d-flex flex-column">
          <v-img
            :src="film.posterPath ? `${tmdbImageBase}/w300${film.posterPath}` : ''"
            height="300"
            cover
            class="film-poster"
          >
            <template #error>
              <div class="d-flex align-center justify-center fill-height bg-surface-variant">
                <v-icon icon="mdi-filmstrip" size="64" color="medium-emphasis" />
              </div>
            </template>
            <div class="film-overlay pa-3 d-flex flex-column justify-end" style="height: 100%">
              <v-chip size="small" color="accent" class="align-self-start mb-auto">
                ⭐ {{ film.rating }}
              </v-chip>
            </div>
          </v-img>
          <v-card-text class="flex-grow-1">
            <h3 class="text-subtitle-1 font-weight-bold mb-1 text-truncate">
              {{ film.title }}
            </h3>
            <p class="text-caption text-medium-emphasis mb-2">
              {{ film.releaseDate }}
            </p>
            <div class="d-flex flex-wrap ga-1 mb-2">
              <v-chip
                v-for="genre in film.genres.slice(0, 2)"
                :key="genre"
                size="x-small"
                variant="tonal"
                color="primary"
              >
                {{ genre }}
              </v-chip>
            </div>
            <div class="d-flex justify-space-between align-center">
              <span class="text-body-2 font-weight-bold text-primary">
                Rp {{ film.rentalPrice.toLocaleString('id-ID') }}
              </span>
              <v-chip size="x-small" :color="film.stock > 0 ? 'success' : 'error'" variant="tonal">
                Stock: {{ film.stock }}
              </v-chip>
            </div>
          </v-card-text>
          <v-card-actions class="px-4 pb-3">
            <v-btn
              variant="tonal"
              color="info"
              size="small"
              class="text-none flex-grow-1"
              :to="`/catalog/${film.id}`"
            >
              <v-icon icon="mdi-pencil" class="mr-1" />
              Edit
            </v-btn>
            <v-btn
              variant="tonal"
              color="error"
              size="small"
              class="text-none flex-grow-1"
              @click="confirmDelete(film)"
            >
              <v-icon icon="mdi-delete" class="mr-1" />
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Empty state -->
      <v-col v-if="!filteredFilms.length && !isLoading" cols="12">
        <v-card class="text-center py-12">
          <v-icon icon="mdi-filmstrip-off" size="64" color="medium-emphasis" class="mb-4" />
          <h3 class="text-h6 mb-2">
            No films found
          </h3>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Add your first film to the catalog or import from TMDB.
          </p>
          <v-btn color="primary" class="text-none" to="/catalog/add">
            <v-icon icon="mdi-plus" class="mr-2" />
            Add Film
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Delete confirmation dialog -->
    <ConfirmDialog
      v-model="deleteDialog"
      title="Confirm Delete"
      :loading="isDeleting"
      @confirm="handleDelete"
    >
      Are you sure you want to delete <strong>{{ filmToDelete?.title }}</strong>?
      This action cannot be undone.
    </ConfirmDialog>

    <!-- TMDB import dialog -->
    <v-dialog v-model="tmdbDialog" max-width="800" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center pa-5">
          <v-icon icon="mdi-database-search" class="mr-2" color="secondary" />
          Import from TMDB
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" size="small" @click="tmdbDialog = false" />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-text-field
            v-model="tmdbSearch"
            placeholder="Search movies on TMDB..."
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            class="mb-4"
            @update:model-value="debouncedTmdbSearch"
          />

          <div v-if="isTmdbLoading" class="text-center py-8">
            <v-progress-circular indeterminate color="primary" />
          </div>

          <v-list v-else-if="tmdbResults?.results?.length" lines="three">
            <v-list-item
              v-for="movie in tmdbResults.results.slice(0, 10)"
              :key="movie.id"
              rounded="lg"
              class="mb-2 tmdb-item"
              border
            >
              <template #prepend>
                <v-avatar size="60" rounded="lg" class="mr-3">
                  <v-img
                    v-if="movie.poster_path"
                    :src="`${tmdbImageBase}/w92${movie.poster_path}`"
                    cover
                  />
                  <v-icon v-else icon="mdi-filmstrip" />
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">
                {{ movie.title }}
                <v-chip
                  v-if="existingTmdbIds.has(movie.id)"
                  size="x-small"
                  color="success"
                  variant="tonal"
                  class="ml-2"
                >
                  <v-icon icon="mdi-check-circle" size="x-small" class="mr-1" />
                  Already Added
                </v-chip>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ movie.release_date }} · ⭐ {{ movie.vote_average?.toFixed(1) }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-truncate">
                {{ movie.overview }}
              </v-list-item-subtitle>
              <template #append>
                <v-btn
                  v-if="existingTmdbIds.has(movie.id)"
                  variant="tonal"
                  size="small"
                  class="text-none"
                  disabled
                >
                  <v-icon icon="mdi-check" class="mr-1" />
                  Added
                </v-btn>
                <v-btn
                  v-else
                  color="primary"
                  variant="tonal"
                  size="small"
                  class="text-none"
                  :loading="importingId === movie.id"
                  @click="importFromTmdb(movie)"
                >
                  <v-icon icon="mdi-import" class="mr-1" />
                  Import
                </v-btn>
              </template>
            </v-list-item>
          </v-list>

          <div v-else class="text-center py-8 text-medium-emphasis">
            <v-icon icon="mdi-movie-search" size="48" class="mb-2" />
            <p>Search for movies to import</p>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useDeleteCatalog, useImportCatalogFromTmdb } from './-composables/useCatalogMutations'

useHead({ title: 'Film Catalog' })

const config = useRuntimeConfig()
const tmdbImageBase = config.public.tmdbImageBase
const showSnackbar = inject<(text: string, color?: string) => void>('showSnackbar')

const search = ref('')
const selectedGenre = ref('')
const viewMode = ref('table')
const deleteDialog = ref(false)
const filmToDelete = ref<TFilm | null>(null)
const tmdbDialog = ref(false)
const tmdbSearch = ref('')
const importingId = ref<number | null>(null)

const headers = [
  { title: '', key: 'poster', width: '60px', sortable: false },
  { title: 'Title', key: 'title' },
  { title: 'Genres', key: 'genres', sortable: false },
  { title: 'Rating', key: 'rating' },
  { title: 'Stock', key: 'stock' },
  { title: 'Price', key: 'rentalPrice' },
  { title: 'Actions', key: 'actions', sortable: false, width: '100px' },
]

// Fetch catalog
const { data: catalogData, isLoading } = useCatalog()

// TMDB search
const { tmdbResults, isTmdbLoading, tmdbSearchQuery: tmdbQueryKeyRef } = useTmdbSearch('tmdb-search')

// TMDB genres
const { genreMap } = useTmdbGenres()

// Mutations
const { mutateAsync: deleteCatalog, isPending: isDeleting } = useDeleteCatalog()
const { mutateAsync: importCatalog } = useImportCatalogFromTmdb()

const allGenres = computed(() => {
  const genres = new Set<string>()
  catalogData.value?.films?.forEach((f: TFilm) => f.genres.forEach((g: string) => genres.add(g)))
  return Array.from(genres).sort()
})

const existingTmdbIds = computed(() => {
  const ids = new Set<number>()
  catalogData.value?.films?.forEach((f: TFilm) => {
    if (f.tmdbId) ids.add(f.tmdbId)
  })
  return ids
})

const filteredFilms = computed(() => {
  let films = catalogData.value?.films || []
  if (search.value) {
    const s = search.value.toLowerCase()
    films = films.filter((f: TFilm) =>
      f.title.toLowerCase().includes(s) || f.overview.toLowerCase().includes(s),
    )
  }
  if (selectedGenre.value) {
    films = films.filter((f: TFilm) => f.genres.includes(selectedGenre.value))
  }
  return films
})

const debouncedTmdbSearch = () => {
  tmdbQueryKeyRef.value = tmdbSearch.value
}

const confirmDelete = (film: TFilm) => {
  filmToDelete.value = film
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!filmToDelete.value) return
  try {
    await deleteCatalog(filmToDelete.value.id)
    showSnackbar?.('Film deleted successfully')
    deleteDialog.value = false
  }
  catch {
    showSnackbar?.('Failed to delete film', 'error')
  }
}

const importFromTmdb = async (movie: TTmdbMovie) => {
  importingId.value = movie.id
  try {
    const genres = (movie.genre_ids || []).map((id: number) => genreMap.value[id] || 'Unknown')
    await importCatalog({
      tmdbId: movie.id,
      title: movie.title,
      overview: movie.overview || '',
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      releaseDate: movie.release_date || '',
      genres: genres.length ? genres : ['Uncategorized'],
      rating: movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : 0,
      stock: 1,
      rentalPrice: 15000,
    })
    showSnackbar?.(`"${movie.title}" imported successfully!`)
  }
  catch (error: any) {
    const message = error?.response?.status === 409
      ? `Film "${movie.title}" sudah ada di catalog`
      : 'Failed to import film'
    showSnackbar?.(message, 'error')
  }
  finally {
    importingId.value = null
  }
}
</script>

<style scoped>
.film-card {
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s ease;
}

.film-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(99, 102, 241, 0.3);
}

.film-poster {
  position: relative;
}

.film-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 60%);
}

.gradient-btn {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%) !important;
}

.tmdb-item {
  transition: background 0.2s ease;
}

.tmdb-item:hover {
  background: rgba(99, 102, 241, 0.05);
}
</style>
