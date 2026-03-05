<template>
  <div>
    <!-- Header -->
    <PageHeader
      title="Tambah Pelanggan Baru"
      subtitle="Tambahkan pelanggan baru ke dalam sistem"
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
            submit-text="Simpan Pelanggan"
            :loading="isSubmitting"
          />
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const showSnackbar = inject<(text: string, color?: string) => void>('showSnackbar')

const membershipTypes = ['Silver', 'Gold', 'Platinum']

// Mutation
const { mutateAsync: addPelanggan, isPending: isSubmitting } = useAddPelanggan()

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
    await addPelanggan(result.data as Record<string, unknown>)
    showSnackbar?.('Pelanggan berhasil ditambahkan!')
    navigateTo('/pelanggan')
  }
  catch (err: unknown) {
    const fetchErr = err as { data?: { statusMessage?: string } }
    showSnackbar?.(fetchErr?.data?.statusMessage || 'Gagal menambahkan pelanggan', 'error')
  }
}
</script>


