<template>
  <div
    style="
      background: linear-gradient(90deg, var(--dark) 20%, var(--primary) 110%);
      width: 100%;
      margin-left: 12px;
      height: 80px;
    "
  >
    <v-toolbar color="#FFFFFF00">
      <v-spacer></v-spacer>

      <v-btn variant="plain" v-if="isLoggedIn" class="navbarBtn">
        {{ userLogin }}

        <v-menu activator="parent" close-on-content-click close-on-back>
          <v-list>
            <v-list-item>
              <!-- <v-list-item-title>{{ item.title }}</v-list-item-title> -->

              <div class="pa-4 text-center">
                <v-dialog v-model="modalProfil" max-width="600">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn
                      variant="plain"
                      prepend-icon="mdi-account"
                      text="Upraviť profil"
                      v-bind="activatorProps"
                      @click="fetchUserData"
                    ></v-btn>
                  </template>
                  <v-form ref="navform">
                    <v-card
                      prepend-icon="mdi-account"
                      title="Profil používateľa"
                    >
                      <v-card-text>
                        <v-divider></v-divider>
                        <v-row>
                          <v-col cols="12" lg="6" sm="12" md="6">
                            <v-text-field
                              v-model="form.login"
                              label="Login"
                              disabled
                            ></v-text-field> </v-col
                          ><v-col cols="12" lg="6" sm="12" md="6">
                            <v-text-field
                              v-model="form.email"
                              label="Email"
                              disabled
                            ></v-text-field>
                          </v-col>

                          <v-divider></v-divider>
                          <v-col cols="12" lg="6" sm="12" md="6">
                            <v-text-field
                              v-model="form.meno"
                              label="Meno"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" lg="6" sm="12" md="6">
                            <v-text-field
                              v-model="form.priezvisko"
                              label="Priezvisko"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" lg="6" sm="12" md="6">
                            <v-text-field
                              v-model="form.heslo"
                              label="Staré heslo"
                              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                              :type="show1 ? 'text' : 'password'"
                              @click:append="show1 = !show1"
                              :rules="[rules.required]"
                              hint="Toto pole je povinné"
                              persistent-hint
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" lg="6" sm="12" md="6">
                            <v-text-field
                              v-model="form.nove_heslo1"
                              label="Nové heslo"
                              :type="show1 ? 'text' : 'password'"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" lg="6" sm="12" md="6">
                            <v-text-field
                              v-model="form.nove_heslo2"
                              label="Potvrďte nové heslo"
                              :rules="[
                                rules.compared(
                                  form.nove_heslo1,
                                  form.nove_heslo2
                                ),
                              ]"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                          text="Zavrieť"
                          variant="plain"
                          @click="modalProfil = false"
                        ></v-btn>

                        <v-btn
                          color="primary"
                          text="Uložiť"
                          variant="tonal"
                          @click="editProfile"
                        ></v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-form>
                </v-dialog>
              </div>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <!-- ////////////////// ALERT S CHYBOU /////////////////////-->
      <v-dialog v-model="upozornenie">
        <v-alert
          title="Chyba"
          type="error"
          max-width="50%"
          closable
          close-icon="mdi-close"
          @click:close="upozornenie = !upozornenie"
          elevation="8"
          icon="mdi-exclamation"
          style="margin-left: 25%"
        >
          <span>{{ chyba }}</span></v-alert
        >
      </v-dialog>
      <v-btn :ripple="false" variant="plain" @click="signout">
        <span class="material-icons logout"> </span>
      </v-btn>
    </v-toolbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      modalProfil: false,
      form: {},
      zaznamy: [],
      rules: {
        required: (value) => !!value || 'Toto pole je povinné.',
        compared: (value1, value2) => value1 === value2 || 'Heslá sa nezhodujú',
      },
      show1: false,
      upozornenie: false,
      chyba: null,
    };
  },
  beforeCreate() {
    this.host = this.$store.getters.selectHost;
    this.apiLink = this.host + '/auth/signout';
    this.profil = this.host + '/auth/whoAmI';
    this.editLink = this.host + '/auth/editProfile';
  },

  computed: {
    ...mapGetters({
      userLogin: 'userLogin',
      isLoggedIn: 'isAuthenticated',
    }),
  },

  methods: {
    signout() {
      this.$router.replace('/login');
      return this.$store.dispatch('LOG_OUT');
    },

    fetchUserData() {
      fetch(`${this.profil}`, { credentials: 'include' })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          this.zaznamy = data;
          this.form = data;
        });
    },
    editProfile() {
      const valid = this.$refs.navform.isValid;

      if (valid) {
        // UPDATE DATA
        fetch(`${this.editLink}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: this.form.id,
            meno: this.form.meno,
            priezvisko: this.form.priezvisko,
            heslo: this.form.heslo,
            nove_heslo: this.form.nove_heslo1,
          }),
        })
          .then((response) => {
            if (response.ok) {
              this.signout();
            }
            return response.json();
          })
          .then((responseData) => {
            if (responseData.statusCode) {
              throw new Error(
                responseData.message || 'Nesprávne vyplnené dáta'
              );
            } else {
              return;
            }
          })
          .catch((error) => {
            this.chyba = error.message;
            this.upozornenie = true;
          });
      } else {
        this.chyba = 'Vyplňte povinné polia podľa požiadaviek formulára';
        this.upozornenie = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.navibar {
  height: 40px;
  margin-left: 12px;
}

.material-icons {
  font-size: 2rem;
  color: var(--dark);
  transition: 0.2s ease-out;
  padding: 20px;
}

.material-icons:hover {
  color: var(--primary);
  transform: translateX(0.5rem);

  &.logout {
    color: var(--dark-alt);
  }
}

.navbarBtn {
  padding-top: 25px;
  transition: 0.2s ease-out;
}
</style>
