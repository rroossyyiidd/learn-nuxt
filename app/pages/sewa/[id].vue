<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="48" />
      <p class="text-body-1 mt-4 text-medium-emphasis">
        Memuat data sewa...
      </p>
    </div>

    <!-- Error state -->
    <v-alert v-else-if="error" type="error" variant="tonal" class="mb-6">
      Data sewa tidak ditemukan. <NuxtLink to="/sewa">
        Kembali ke daftar sewa
      </NuxtLink>
    </v-alert>

    <!-- Content -->
    <template v-else-if="sewaData?.sewa">
      <!-- Header -->
      <div class="d-flex align-center mb-6">
        <v-btn
          icon="mdi-arrow-left"
          variant="text"
          class="mr-3"
          to="/sewa"
        />
        <div>
          <h1 class="text-h5 font-weight-bold">
            Edit Data Sewa
          </h1>
          <p class="text-body-2 text-medium-emphasis">
            Ubah data sewa "{{ sewaData.sewa.pelangganName }}"
          </p>
        </div>
      </div>

      <!-- Form -->
      <v-card>
        <v-card-text class="pa-5 pa-md-8">
          <v-form ref="formRef" @submit.prevent="handleSubmit">
            <v-row>
              <!-- Pelanggan selection -->
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="selectedPelanggan"
                  :items="pelangganOptions"
                  item-title="name"
                  item-value="id"
                  return-object
                  label="Pilih Pelanggan *"
                  prepend-inner-icon="mdi-account"
                  :error-messages="fieldErrors.pelangganId"
                  @update:model-value="onPelangganChange"
                >
                  <template #item="{ item, props: itemProps }">
                    <v-list-item v-bind="itemProps">
                      <template #subtitle>
                        <span>{{ item.email }} · {{ item.membershipType }}</span>
                      </template>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model="form.rentalDate"
                  label="Tanggal Sewa *"
                  type="date"
                  prepend-inner-icon="mdi-calendar"
                  :error-messages="fieldErrors.rentalDate"
                />
              </v-col>

              <v-col cols="12" md="3">
                <v-select
                  v-model="form.status"
                  :items="statusOptions"
                  label="Status"
                  prepend-inner-icon="mdi-flag"
                />
              </v-col>
            </v-row>

            <!-- Dynamic film items -->
            <v-divider class="my-6" />
            <div class="d-flex align-center justify-space-between mb-4">
              <div>
                <h3 class="text-subtitle-1 font-weight-bold">
                  <v-icon icon="mdi-filmstrip" class="mr-1" />
                  Daftar Film yang Disewa
                </h3>
                <p class="text-body-2 text-medium-emphasis">
                  Tambahkan film dan tentukan durasi sewa masing-masing
                </p>
              </div>
              <v-btn
                color="primary"
                variant="tonal"
                class="text-none"
                @click="addItem"
              >
                <v-icon icon="mdi-plus" class="mr-1" />
                Tambah Film
              </v-btn>
            </div>

            <v-alert
              v-if="fieldErrors.items"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-4"
            >
              {{ fieldErrors.items }}
            </v-alert>

            <v-card
              v-for="(item, index) in form.items"
              :key="index"
              variant="outlined"
              class="mb-3 pa-4"
            >
              <div class="d-flex align-center justify-space-between mb-3">
                <v-chip size="small" color="primary" variant="tonal">
                  Film #{{ index + 1 }}
                </v-chip>
                <v-btn
                  v-if="form.items.length > 1"
                  icon="mdi-close"
                  variant="text"
                  size="x-small"
                  color="error"
                  @click="removeItem(index)"
                />
              </div>
              <v-row>
                <v-col cols="12" md="5">
                  <v-autocomplete
                    v-model="item.filmId"
                    :items="filmOptions"
                    item-title="title"
                    item-value="id"
                    label="Pilih Film *"
                    prepend-inner-icon="mdi-movie"
                    :error-messages="itemErrors[index]?.filmId"
                    @update:model-value="(val: string) => onFilmChange(index, val)"
                  >
                    <template #item="{ item: filmItem, props: itemProps }">
                      <v-list-item v-bind="itemProps">
                        <template #subtitle>
                          <span>Rp {{ filmItem.rentalPrice.toLocaleString('id-ID') }}/hari · Stok: {{ filmItem.stock }}</span>
                        </template>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model.number="item.duration"
                    label="Durasi (hari) *"
                    type="number"
                    min="1"
                    prepend-inner-icon="mdi-clock-outline"
                    :error-messages="itemErrors[index]?.duration"
                    @update:model-value="recalcItemPrice(index)"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    :model-value="item.rentalPrice"
                    label="Harga Sewa"
                    type="number"
                    prefix="Rp"
                    prepend-inner-icon="mdi-cash"
                    readonly
                    bg-color="surface-variant"
                  />
                </v-col>
              </v-row>
            </v-card>

            <!-- Total price -->
            <v-card variant="tonal" color="primary" class="pa-4 mt-4" rounded="lg">
              <div class="d-flex justify-space-between align-center">
                <span class="text-subtitle-1 font-weight-medium">Total Harga Sewa</span>
                <span class="text-h5 font-weight-bold">
                  Rp {{ totalPrice.toLocaleString('id-ID') }}
                </span>
              </div>
            </v-card>

            <!-- Action buttons -->
            <v-divider class="my-6" />
            <div class="d-flex justify-end ga-3 mt-4">
              <v-btn
                variant="text"
                size="large"
                class="text-none px-8"
                to="/sewa"
              >
                Batal
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
                Update Sewa
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
const showSnackbar = inject<(text: string, color?: string) => void>('showSnackbar')
const queryClient = useQueryClient()

const sewaId = route.params.id as string
const isSubmitting = ref(false)
const selectedPelanggan = ref<TPelanggan | null>(null)
const statusOptions = Object.values(ESewaStatus)

// Fetch data
const { data: sewaData, isLoading, error } = useSewaDetail(sewaId)
const { data: pelangganData } = usePelanggan()
const { data: catalogData } = useCatalog()

const pelangganOptions = computed(() => pelangganData.value?.pelanggan || [])
const filmOptions = computed(() => catalogData.value?.films || [])

const form = reactive({
  pelangganId: '',
  pelangganName: '',
  rentalDate: '',
  status: ESewaStatus.AKTIF as ESewaStatus,
  items: [] as { filmId: string, filmTitle: string, duration: number, rentalPrice: number }[],
})

const fieldErrors = reactive<Record<string, string | string[]>>({
  pelangganId: '',
  rentalDate: '',
  items: '',
})

const itemErrors = reactive<Record<number, Record<string, string>>>({})

const totalPrice = computed(() =>
  form.items.reduce((sum, item) => sum + (item.rentalPrice || 0), 0),
)

// Populate form when data loads
watch(() => sewaData.value, (data) => {
  if (data?.sewa) {
    form.pelangganId = data.sewa.pelangganId
    form.pelangganName = data.sewa.pelangganName
    form.rentalDate = data.sewa.rentalDate
    form.status = data.sewa.status
    form.items = data.sewa.items.map((i) => ({ ...i }))

    // Set selected pelanggan
    const pelanggan = pelangganOptions.value.find((p: TPelanggan) => p.id === data.sewa.pelangganId)
    if (pelanggan) selectedPelanggan.value = pelanggan
  }
}, { immediate: true })

// Also watch pelangganOptions in case they load after sewaData
watch(() => pelangganData.value, () => {
  if (form.pelangganId && !selectedPelanggan.value) {
    const pelanggan = pelangganOptions.value.find((p: TPelanggan) => p.id === form.pelangganId)
    if (pelanggan) selectedPelanggan.value = pelanggan
  }
}, { immediate: true })

const onPelangganChange = (pelanggan: TPelanggan | null) => {
  if (pelanggan) {
    form.pelangganId = pelanggan.id
    form.pelangganName = pelanggan.name
  }
  else {
    form.pelangganId = ''
    form.pelangganName = ''
  }
}

const onFilmChange = (index: number, filmId: string) => {
  const film = filmOptions.value.find((f: TFilm) => f.id === filmId)
  if (film) {
    form.items[index]!.filmTitle = film.title
    form.items[index]!.rentalPrice = film.rentalPrice * (form.items[index]!.duration || 1)
  }
}

const recalcItemPrice = (index: number) => {
  const item = form.items[index]!
  const film = filmOptions.value.find((f: TFilm) => f.id === item.filmId)
  if (film) {
    item.rentalPrice = film.rentalPrice * (item.duration || 1)
  }
}

const addItem = () => {
  form.items.push({ filmId: '', filmTitle: '', duration: 1, rentalPrice: 0 })
}

const removeItem = (index: number) => {
  form.items.splice(index, 1)
  delete itemErrors[index]
}

const handleSubmit = async () => {
  Object.keys(fieldErrors).forEach((key) => { fieldErrors[key] = '' })
  Object.keys(itemErrors).forEach((key) => { delete itemErrors[Number(key)] })

  const payload = {
    ...form,
    totalPrice: totalPrice.value,
  }

  const result = sewaSchema.safeParse(payload)
  if (!result.success) {
    const flat = result.error.flatten()
    Object.entries(flat.fieldErrors).forEach(([key, msgs]) => {
      if (msgs && msgs.length > 0) {
        fieldErrors[key] = msgs[0] ?? ''
      }
    })

    result.error.issues.forEach((issue) => {
      if (issue.path[0] === 'items' && typeof issue.path[1] === 'number') {
        const idx = issue.path[1]
        const field = issue.path[2] as string
        if (!itemErrors[idx]) itemErrors[idx] = {}
        itemErrors[idx]![field] = issue.message
      }
    })
    return
  }

  isSubmitting.value = true
  try {
    await $fetch<TSewaDetailResponse>(`/api/sewa/${sewaId}`, {
      method: 'PUT',
      body: result.data,
    })
    showSnackbar?.('Data sewa berhasil diupdate!')
    queryClient.invalidateQueries({ queryKey: ['sewa'] })
    navigateTo('/sewa')
  }
  catch (err: unknown) {
    const fetchErr = err as { data?: { statusMessage?: string } }
    showSnackbar?.(fetchErr?.data?.statusMessage || 'Gagal mengupdate data sewa', 'error')
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.gradient-btn {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%) !important;
}
</style>
