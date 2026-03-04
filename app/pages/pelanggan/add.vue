<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center mb-6">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        class="mr-3"
        to="/pelanggan"
      />
      <div>
        <h1 class="text-h5 font-weight-bold">
          Tambah Pelanggan Baru
        </h1>
        <p class="text-body-2 text-medium-emphasis">
          Tambahkan pelanggan baru ke dalam sistem
        </p>
      </div>
    </div>

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
          <v-divider class="my-6" />
          <div class="d-flex justify-end ga-3 mt-4">
            <v-btn
              variant="text"
              size="large"
              class="text-none px-8"
              to="/pelanggan"
            >
              Batal
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              size="large"
              class="text-none gradient-btn px-8"
              :loading="isSubmitting"
            >
              <v-icon icon="mdi-content-save" class="mr-2" />
              Simpan Pelanggan
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const showSnackbar = inject<(text: string, color?: string) => void>('showSnackbar')
const queryClient = useQueryClient()

const isSubmitting = ref(false)
const membershipTypes = ['Silver', 'Gold', 'Platinum']

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

  isSubmitting.value = true
  try {
    await $fetch('/api/pelanggan', {
      method: 'POST',
      body: result.data,
    })
    showSnackbar?.('Pelanggan berhasil ditambahkan!')
    queryClient.invalidateQueries({ queryKey: ['pelanggan'] })
    navigateTo('/pelanggan')
  }
  catch (err: unknown) {
    const fetchErr = err as { data?: { statusMessage?: string } }
    showSnackbar?.(fetchErr?.data?.statusMessage || 'Gagal menambahkan pelanggan', 'error')
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
