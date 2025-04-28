<template>
  <div class="login-background">
    <v-form class="login-form" @submit.prevent="submitForm">
      <v-img class="my-4" max-width="380" src="../src/assets/logo1.png"></v-img>

      <v-card class="pa-12 pb-8" elevation="8" max-width="380" rounded="lg">
        <div class="text-subtitle-1 text-medium-emphasis">Login</div>

        <v-text-field
          v-model="userLogin"
          placeholder="Zadajte login"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
        ></v-text-field>

        <div
          class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
        >
          Heslo
        </div>

        <v-text-field
          v-model="userPassword"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          placeholder="Zadajte heslo"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
        ></v-text-field>

        <v-alert
          v-if="isError"
          title="Chyba"
          :text="isError"
          type="error"
          closable
          close-icon="mdi-close"
          elevation="8"
          icon="mdi-exclamation"
        ></v-alert>
        <v-btn
          block
          class="mb-8 mt-6"
          color="blue"
          size="large"
          variant="tonal"
          type="submit"
        >
          Prihlásiť
        </v-btn>
      </v-card>
    </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      userLogin: '',
      userPassword: '',
      formIsValid: true,

      showError: null,
      isError: false,
      isLoading: false,
    };
  },
  beforeCreate() {
    this.host = this.$store.getters.selectHost;
    this.apiLink = this.host + '/auth/signin';
  },

  methods: {
    async submitForm() {
      try {
        this.isLoading = true;
        await this.$store.dispatch('SIGNIN', {
          login: this.userLogin,
          heslo: this.userPassword,
        });
        this.$router.replace('/klienti');
      } catch (err) {
        if (err.message === 'Failed to fetch') {
          this.isError =
            'Serverová chyba. Prosím kontaktujte administrátora systému.';
        } else {
          this.isError = err.message || err.error || 'Neautorizovaný prístup.';
        }
      }

      this.isLoading = false;
    },

    handleError() {
      this.isError = null;
    },
  },
};
</script>

<style scoped>
.login-background {
  background: linear-gradient(103deg, var(--dark), var(--primary));
  margin: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.login-form {
  width: 30%;
  height: 70%;
  min-width: 180px;
}

.logo-1 {
  margin-right: 20%;
  padding-right: 10%;
}

.v-alert__prepend {
  margin-inline-end: 30px !important;
}
</style>
