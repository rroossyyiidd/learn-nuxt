<template>
  <div>
    <!-- Header -->
    <PageListHeader title="Data Pelanggan" subtitle="Kelola data pelanggan rental CD">
      <v-btn
        color="primary"
        class="text-none gradient-btn"
        to="/pelanggan/add"
      >
        <v-icon icon="mdi-plus" class="mr-2" />
        Tambah Pelanggan
      </v-btn>
    </PageListHeader>

    <!-- Search and filters -->
    <v-card class="mb-6">
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              placeholder="Cari pelanggan..."
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedMembership"
              :items="membershipTypes"
              label="Filter Membership"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedStatus"
              :items="statusOptions"
              item-title="label"
              item-value="value"
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
        :items="filteredPelanggan"
        :loading="isLoading"
        :items-per-page="10"
      >
        <template #item.name="{ item }">
          <div class="font-weight-medium">
            {{ item.name }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ item.email }}
          </div>
        </template>

        <template #item.membershipType="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            :color="membershipColor(item.membershipType)"
          >
            <v-icon start size="14" :icon="membershipIcon(item.membershipType)" />
            {{ item.membershipType }}
          </v-chip>
        </template>

        <template #item.isActive="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            :color="item.isActive ? 'success' : 'error'"
          >
            {{ item.isActive ? 'Aktif' : 'Nonaktif' }}
          </v-chip>
        </template>

        <template #item.createdAt="{ item }">
          <span class="text-body-2">
            {{ new Date(item.createdAt).toLocaleDateString('id-ID') }}
          </span>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex ga-1">
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              color="info"
              :to="`/pelanggan/${item.id}`"
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
      Apakah Anda yakin ingin menghapus pelanggan <strong>{{ pelangganToDelete?.name }}</strong>?
      Tindakan ini tidak dapat dibatalkan.
    </ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Data Pelanggan' })

const showSnackbar = inject<(text: string, color?: string) => void>('showSnackbar')

const search = ref('')
const selectedMembership = ref('')
const selectedStatus = ref<boolean | null>(null)
const deleteDialog = ref(false)
const pelangganToDelete = ref<TPelanggan | null>(null)

const membershipTypes = ['Silver', 'Gold', 'Platinum']
const statusOptions = [
  { label: 'Aktif', value: true },
  { label: 'Nonaktif', value: false },
]

const headers = [
  { title: 'Nama', key: 'name' },
  { title: 'Telepon', key: 'phone' },
  { title: 'Membership', key: 'membershipType' },
  { title: 'Status', key: 'isActive' },
  { title: 'Terdaftar', key: 'createdAt' },
  { title: 'Aksi', key: 'actions', sortable: false, width: '100px' },
]

const { data: pelangganData, isLoading } = usePelanggan()

// Mutation
const { mutateAsync: deletePelanggan, isPending: isDeleting } = useDeletePelanggan()

const filteredPelanggan = computed(() => {
  let list = pelangganData.value?.pelanggan || []
  if (search.value) {
    const s = search.value.toLowerCase()
    list = list.filter((p: TPelanggan) =>
      p.name.toLowerCase().includes(s)
      || p.email.toLowerCase().includes(s)
      || p.phone.includes(s),
    )
  }
  if (selectedMembership.value) {
    list = list.filter((p: TPelanggan) => p.membershipType === selectedMembership.value)
  }
  if (selectedStatus.value !== null && selectedStatus.value !== undefined) {
    list = list.filter((p: TPelanggan) => p.isActive === selectedStatus.value)
  }
  return list
})

const membershipColor = (type: string) => {
  switch (type) {
    case 'Platinum': return 'purple'
    case 'Gold': return 'amber'
    case 'Silver': return 'blue-grey'
    default: return 'grey'
  }
}

const membershipIcon = (type: string) => {
  switch (type) {
    case 'Platinum': return 'mdi-crown'
    case 'Gold': return 'mdi-medal'
    case 'Silver': return 'mdi-shield-star'
    default: return 'mdi-account'
  }
}

const confirmDelete = (pelanggan: TPelanggan) => {
  pelangganToDelete.value = pelanggan
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!pelangganToDelete.value) return
  try {
    await deletePelanggan(pelangganToDelete.value.id)
    showSnackbar?.('Pelanggan berhasil dihapus')
    deleteDialog.value = false
  }
  catch {
    showSnackbar?.('Gagal menghapus pelanggan', 'error')
  }
}
</script>

<style scoped>
.gradient-btn {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%) !important;
}
</style>
