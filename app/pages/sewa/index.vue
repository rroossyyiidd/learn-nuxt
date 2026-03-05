<template>
  <div>
    <!-- Header -->
    <PageListHeader title="Data Sewa" subtitle="Kelola data penyewaan film CD">
      <v-btn
        color="primary"
        class="text-none gradient-btn"
        to="/sewa/add"
      >
        <v-icon icon="mdi-plus" class="mr-2" />
        Tambah Sewa
      </v-btn>
    </PageListHeader>

    <!-- Search and filters -->
    <v-card class="mb-6">
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="search"
              placeholder="Cari berdasarkan pelanggan atau film..."
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedStatus"
              :items="statusOptions"
              label="Filter Status"
              clearable
              hide-details
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Table -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredSewa"
        :loading="isLoading"
        :items-per-page="10"
      >
        <template #item.pelangganName="{ item }">
          <div class="font-weight-medium">
            {{ item.pelangganName }}
          </div>
        </template>

        <template #item.items="{ item }">
          <div class="d-flex flex-wrap ga-1 py-1">
            <v-chip
              v-for="(film, idx) in item.items.slice(0, 2)"
              :key="idx"
              size="x-small"
              variant="tonal"
              color="primary"
            >
              {{ film.filmTitle }} ({{ film.duration }}hr)
            </v-chip>
            <v-chip v-if="item.items.length > 2" size="x-small" variant="tonal">
              +{{ item.items.length - 2 }} lainnya
            </v-chip>
          </div>
        </template>

        <template #item.totalPrice="{ item }">
          <span class="font-weight-medium">
            Rp {{ item.totalPrice.toLocaleString('id-ID') }}
          </span>
        </template>

        <template #item.status="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            :color="statusColor(item.status)"
          >
            <v-icon start size="14" :icon="statusIcon(item.status)" />
            {{ item.status }}
          </v-chip>
        </template>

        <template #item.rentalDate="{ item }">
          <span class="text-body-2">
            {{ new Date(item.rentalDate).toLocaleDateString('id-ID') }}
          </span>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex ga-1">
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              color="info"
              :to="`/sewa/${item.id}`"
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

    <!-- Delete confirmation dialog -->
    <ConfirmDialog
      v-model="deleteDialog"
      title="Konfirmasi Hapus"
      :loading="isDeleting"
      confirm-text="Hapus"
      cancel-text="Batal"
      @confirm="handleDelete"
    >
      Apakah Anda yakin ingin menghapus data sewa pelanggan
      <strong>{{ sewaToDelete?.pelangganName }}</strong>?
      Tindakan ini tidak dapat dibatalkan.
    </ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { useSewa } from './-composables/useSewa'
import { useDeleteSewa } from './-composables/useSewaMutations'
import type { TSewa } from './-types/sewa'

useHead({ title: 'Data Sewa' })

const showSnackbar = inject<(text: string, color?: string) => void>('showSnackbar')

const search = ref('')
const selectedStatus = ref<ESewaStatus | null>(null)
const deleteDialog = ref(false)
const sewaToDelete = ref<TSewa | null>(null)

const statusOptions = Object.values(ESewaStatus)

const headers = [
  { title: 'Pelanggan', key: 'pelangganName' },
  { title: 'Film Disewa', key: 'items', sortable: false },
  { title: 'Total Harga', key: 'totalPrice' },
  { title: 'Status', key: 'status' },
  { title: 'Tanggal Sewa', key: 'rentalDate' },
  { title: 'Aksi', key: 'actions', sortable: false, width: '100px' },
]

const { data: sewaData, isLoading } = useSewa()

// Mutation
const { mutateAsync: deleteSewa, isPending: isDeleting } = useDeleteSewa()

const filteredSewa = computed(() => {
  let list = sewaData.value?.sewa || []
  if (search.value) {
    const s = search.value.toLowerCase()
    list = list.filter((item: TSewa) =>
      item.pelangganName.toLowerCase().includes(s)
      || item.items.some((i) => i.filmTitle.toLowerCase().includes(s)),
    )
  }
  if (selectedStatus.value) {
    list = list.filter((item: TSewa) => item.status === selectedStatus.value)
  }
  return list
})

const confirmDelete = (sewa: TSewa) => {
  sewaToDelete.value = sewa
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!sewaToDelete.value) return
  try {
    await deleteSewa(sewaToDelete.value.id)
    showSnackbar?.('Data sewa berhasil dihapus')
    deleteDialog.value = false
  }
  catch {
    showSnackbar?.('Gagal menghapus data sewa', 'error')
  }
}
</script>

<style scoped>
.gradient-btn {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%) !important;
}
</style>
