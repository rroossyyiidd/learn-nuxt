<template>
  <div>
    <!-- Loading state -->
    <LoadingState v-if="isLoading" text="Memuat data pelanggan..." />

    <!-- Error state -->
    <ErrorState
      v-else-if="error"
      message="Pelanggan tidak ditemukan."
      link-text="Kembali ke daftar pelanggan"
      link-to="/pelanggan"
    />

    <!-- Content -->
    <template v-else-if="pelangganData?.pelanggan">
      <!-- Header -->
      <PageHeader
        title="Edit Pelanggan"
        :subtitle="`Ubah data &quot;${pelangganData.pelanggan.name}&quot;`"
        back-to="/pelanggan"
      />

      <!-- Form -->
      <v-card>
        <v-card-text class="pa-5 pa-md-8">
          <v-form ref="formRef" @submit.prevent="handleSubmit">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.name"
                  label="Nama Lengkap *"
                  prepend-inner-icon="mdi-account"
                  :error-messages="fieldErrors.name"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.email"
                  label="Email *"
                  type="email"
                  prepend-inner-icon="mdi-email"
                  :error-messages="fieldErrors.email"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.phone"
                  label="Nomor Telepon *"
                  prepend-inner-icon="mdi-phone"
                  :error-messages="fieldErrors.phone"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="form.membershipType"
                  :items="membershipTypes"
                  label="Tipe Membership *"
                  prepend-inner-icon="mdi-card-account-details"
                  :error-messages="fieldErrors.membershipType"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="form.address"
                  label="Alamat *"
                  prepend-inner-icon="mdi-map-marker"
                  rows="3"
                  :error-messages="fieldErrors.address"
                />
              </v-col>

              <v-col cols="12">
                <v-switch
                  v-model="form.isActive"
                  label="Status Aktif"
                  color="primary"
                  hide-details
                />
              </v-col>
            </v-row>

            <!-- Action buttons -->
            <FormActions
              cancel-to="/pelanggan"
              cancel-text="Batal"
              submit-text="Update Pelanggan"
              :loading="isSubmitting"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const showSnackbar = inject<(text: string, color?: string) => void>('showSnackbar')

const pelangganId = route.params.id as string
const membershipTypes = ['Silver', 'Gold', 'Platinum']

const { data: pelangganData, isLoading, error } = usePelangganDetail(pelangganId)

// Mutation
const { mutateAsync: updatePelanggan, isPending: isSubmitting } = useUpdatePelanggan(pelangganId)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  membershipType: 'Silver' as 'Silver' | 'Gold' | 'Platinum',
  isActive: true,
})

const fieldErrors = reactive<Record<string, string | string[]>>({
  name: '',
  email: '',
  phone: '',
  address: '',
  membershipType: '',
})

// Populate form when data loads
watch(() => pelangganData.value, (data) => {
  if (data?.pelanggan) {
    form.name = data.pelanggan.name
    form.email = data.pelanggan.email
    form.phone = data.pelanggan.phone
    form.address = data.pelanggan.address
    form.membershipType = data.pelanggan.membershipType
    form.isActive = data.pelanggan.isActive
  }
}, { immediate: true })

const handleSubmit = async () => {
  Object.keys(fieldErrors).forEach((key) => { fieldErrors[key] = '' })

  const result = pelangganSchema.safeParse(form)
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
    await updatePelanggan(result.data as Record<string, unknown>)
    showSnackbar?.('Pelanggan berhasil diupdate!')
    navigateTo('/pelanggan')
  }
  catch (err: unknown) {
    const fetchErr = err as { data?: { statusMessage?: string } }
    showSnackbar?.(fetchErr?.data?.statusMessage || 'Gagal mengupdate pelanggan', 'error')
  }
}
</script>


