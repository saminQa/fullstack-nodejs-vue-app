<template>
  <v-container fluid>
    <v-card style="overflow: inherit; max-width: 98%" class="elevation-7">
      <!-- //////////////  TABULKA /////////////////////// -->
      <v-card-text style="margin: 30px 0 0">
        <v-data-table
          :headers="headers"
          :items="zaznamy"
          item-value="id"
          v-model:items-per-page="itemsPerPage"
          :sort-by="[
            { key: 'id', order: 'asc' },
            { key: 'bd_is_active', order: 'desc' },
            { key: 'priezvisko', order: 'asc' },
          ]"
          :search="search"
          show-current-page
          hover
          items-per-page-text="Zobraziť"
          sort-asc-icon="mdi mdi-arrow-up"
          sort-desc-icon="mdi mdi-arrow-down"
          prev-icon="mdi mdi-chevron-left"
          next-icon="mdi-chevron-right"
          last-icon="mdi mdi-chevron-double-right"
          first-icon="mdi mdi-chevron-double-left"
          class="row-height-30"
          width="500"
        >
          <!-- ////////////////// Hlavička tabuľky /////////////////////-->
          <template v-slot:top>
            <v-toolbar
              flat
              style="
                background: linear-gradient(30deg, var(--dark), var(--primary));
              "
              rounded
            >
              <v-toolbar-title>
                <!-- ////// Titulka tabulky -->
                <div class="titulka">
                  <div class="titulka-text">{{ titulka }}</div>
                </div></v-toolbar-title
              >
              <v-dialog v-model="dialog" max-width="1200px">
                <template v-slot:activator="{ props }">
                  <v-btn
                    color="var(--dark)"
                    class="mb-9 tabulka-btn"
                    v-bind="props"
                    size="large"
                    selected-class="tabulka-button"
                    variant="plain"
                  >
                    + Nový záznam
                  </v-btn>
                  <v-card width="344" class="float-right mr-3">
                    <v-card-title>
                      <v-text-field
                        v-model="search"
                        label="Hľadať"
                        prepend-inner-icon="mdi mdi-magnify"
                        clearable
                        hide-details="auto"
                        variant="outlined"
                        density="compact"
                        class="tabulka-search"
                        clear-icon="mdi-close"
                      ></v-text-field>
                    </v-card-title>
                  </v-card>
                </template>

                <!-- ////////////////// MODAL NA UPRAVU ZAZNAMU A NOVY ZAZNAM/////////////////////-->
                <v-form @submit.prevent="submitForm(form.id)">
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" lg="6" sm="12" md="6">
                            <v-text-field
                              v-model="form.login"
                              label="Login"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            lg="6"
                            sm="12"
                            md="6"
                            v-if="this.editedIndex === -1"
                          >
                            <v-text-field
                              v-model="form.heslo"
                              label="Heslo"
                            ></v-text-field>
                          </v-col>
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
                              v-model="form.email"
                              label="Email"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" lg="6" sm="12" md="6">
                            <v-select
                              v-if="form.id"
                              v-model="form.bd_is_active"
                              :items="aktivna.options"
                              label="Aktívny"
                            ></v-select>
                          </v-col>

                          <!-- <v-col> -->
                          <!-- <v-text-field v-model="form.id"></v-text-field> -->
                          <!-- </v-col> -->
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue-darken-1"
                        variant="text"
                        @click="close"
                      >
                        Zrušiť
                      </v-btn>
                      <v-btn
                        v-if="form.id === ''"
                        color="success"
                        variant="text"
                        type="submit"
                        >NOVÝ ZÁZNAM</v-btn
                      >
                      <v-btn
                        v-else
                        color="blue-darken-1"
                        variant="text"
                        type="submit"
                      >
                        ULOŽIŤ
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-form>
              </v-dialog>

              <!-- ///////// MODAL NA VYMAZANIE ZAZNAMU ////////////////////
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"
                  >Ste si istý, že chce vymazať tento záznam?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="closeDelete"
                    >Zrušiť</v-btn
                  >
                  <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="deleteItemConfirm(form.id)"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog> -->
            </v-toolbar>
          </template>

          <!-- Vizualna uprava stlpca Akcie -->
          <template v-slot:item.akcie="{ item }">
            <v-icon size="small" class="me-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <!-- <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon> -->
          </template>
        </v-data-table>
        <v-dialog v-model="alert.show">
          <v-alert
            v-if="alert.show"
            :type="alert.type"
            :text="alert.message"
            class="custom-alert"
            closable
            @click:close="alert.show = false"
        /></v-dialog>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,

    headers: [
      { title: 'Akcie', key: 'akcie', width: 75 },
      { title: 'ID', key: 'id', align: ' d-none' },
      { title: 'Login', key: 'login', width: 150 },
      { title: 'Meno', key: 'meno', width: 150 },
      { title: 'Priezvisko', key: 'priezvisko', width: 150 },

      { title: 'Email', key: 'email', width: 250 },
      { title: 'Aktívny', key: 'bd_is_active', width: 75 },
    ],
    zaznamy: [],
    itemsPerPage: 50,
    search: '',
    editedIndex: -1,
    form: {},
    defaultItem: {},
    rowHeight: 60,
    titulka: 'Zoznam všetkých používateľov',
    aktivna: {
      selected: 1,
      options: [
        { title: 'aktívny', value: 1 },
        { title: 'neaktívny', value: 0 },
      ],
    },

    // ---- ERROR HANDLING ----
    alert: {
      show: false,
      type: 'error',
      message: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nový záznam' : 'Upraviť záznam';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  beforeCreate() {
    this.host = this.$store.getters.selectHost;
    this.apiLink = this.host + '/auth';
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      try {
        fetch(this.apiLink, { credentials: 'include' })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
          })
          .then((data) => {
            this.zaznamy = data;
            //alert(JSON.stringify(this.zaznamy));
            // var keys = Object.keys(this.items[0]);
            // keys.forEach((key) => this.columns.push(key));
            // alert(JSON.stringify(this.columns));
          });
      } catch (error) {
        this.alert = {
          show: true,
          type: 'error',
          message: error,
        };
      }
    },

    editItem(item) {
      this.editedIndex = this.zaznamy.indexOf(item);
      this.form = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.zaznamy.indexOf(item);
      this.form = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm(id) {
      fetch(`${this.apiLink}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => {
          if (response.ok) {
            this.initialize();
          } else {
            throw new Error('Požiadavka sa neuložila!');
          }
        })
        .catch((error) => {
          console.log(error);
          this.error = error.message;
          this.alert = {
            show: true,
            type: 'error',
            message: errorMessage,
          };
        });
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.form = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.form = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    submitForm(id) {
      if (this.editedIndex > -1) {
        // UPDATE DATA
        fetch(`${this.apiLink}/${id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            login: this.form.login,
            heslo: this.form.heslo,
            meno: this.form.meno,
            priezvisko: this.form.priezvisko,

            email: this.form.email,
            bd_is_active: +this.form.bd_is_active,
          }),
        })
          .then((response) => {
            if (response.ok) {
              this.initialize();
            } else {
              throw new Error('Na zmenu tohto používateľa nemáte oprávnenie');
            }
          })
          .catch((error) => {
            this.error = error.message;
            this.alert = {
              show: true,
              type: 'error',
              message: error.message,
            };
          });
      } else {
        //SAVE NEW DATA
        fetch(`${this.apiLink}/signup`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            login: this.form.login,
            heslo: this.form.heslo,
            meno: this.form.meno,
            priezvisko: this.form.priezvisko,

            email: this.form.email,
          }),
        })
          .then((response) => {
            if (response.ok) {
              this.initialize();
            } else {
              throw new Error('Nový používateľ sa neuložil!');
            }
          })
          .catch((error) => {
            console.log(error);
            this.error = error.message;
            this.alert = {
              show: true,
              type: 'error',
              message: this.error,
            };
          });
      }
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
// .v-data-table.row-height-30 td {
//   height: 30px !important;
// }
* {
  font-family: 'Poppins', sans-serif;
}
.custom-alert {
  position: fixed !important;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  min-width: 300px;
  max-width: 600px;
}
</style>
