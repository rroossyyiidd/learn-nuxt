<template>
  <v-app>
    <v-main class="auth-main">
      <v-container fluid class="fill-height">
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="8" md="5" lg="4" xl="3">
            <slot />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.auth-main {
  background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #F3E8FF 100%);
  min-height: 100vh;
}

:global(.v-theme--dark) .auth-main {
  background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%);
}
</style>
