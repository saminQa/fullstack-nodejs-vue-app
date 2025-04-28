<template>
  <v-form ref="form" @submit.prevent="$emit('on-submit', childForm)">
    <v-card>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" lg="2" md="2">
              <v-text-field
                v-model="childForm.titul"
                label="Titul"
                :readonly="isReadOnly"
                counter
                maxlength="255"
                @input="updateField('titul', $event.target.value)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="3" md="3">
              <v-text-field
                v-model="childForm.meno"
                label="Meno"
                :readonly="isReadOnly"
                counter
                maxlength="255"
                @input="updateField('meno', $event.target.value)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="7" sm="12" md="6">
              <v-text-field
                v-model="childForm.priezvisko"
                label="Priezvisko / Názov spoločnosti"
                :readonly="isReadOnly"
                counter
                maxlength="255"
                hint="Toto pole je povinné"
                persistent-hint
                :rules="[rules.required]"
                @input="updateField('priezvisko', $event.target.value)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row></v-row>
          <v-row>
            <v-col cols="12" lg="3" md="4">
              <v-text-field
                v-model="childForm.rc_ico"
                label="RČ / IČO"
                :readonly="isReadOnly"
                maxlength="255"
                hint="Toto pole je povinné"
                persistent-hint
                :rules="[rules.required]"
                @input="updateField('rc_ico', $event.target.value)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col cols="12" lg="4" sm="12" md="3">
              <v-text-field
                v-model="childForm.ulica"
                label="Ulica"
                :readonly="isReadOnly"
                counter
                maxlength="255"
                @input="updateField('ulica', $event.target.value)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="2" sm="12" md="2">
              <v-text-field
                v-model="childForm.supisne_cislo"
                label="Súpisné číslo"
                :readonly="isReadOnly"
                counter
                maxlength="255"
                @input="updateField('supisne_cislo', $event.target.value)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4" sm="12" md="4">
              <v-text-field
                v-model="childForm.mesto"
                label="Mesto"
                :readonly="isReadOnly"
                counter
                maxlength="255"
                @input="updateField('mesto', $event.target.value)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="2" sm="12" md="2">
              <v-text-field
                v-model="childForm.psc"
                label="PSČ"
                :readonly="isReadOnly"
                counter
                hint="Bez medzery."
                persistent-hint
                maxlength="5"
                @input="updateField('psc', $event.target.value)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" lg="4" sm="12" md="4">
              <v-text-field
                v-model="childForm.mobil"
                placeholder="+421"
                label="Mobil"
                :readonly="isReadOnly"
                maxlength="255"
                @input="updateField('mobil', $event.target.value)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="3" sm="12" md="4">
              <v-text-field
                v-model="childForm.telefon"
                placeholder="+421"
                label="Telefón"
                :readonly="isReadOnly"
                maxlength="255"
                @input="updateField('telefon', $event.target.value)"
              ></v-text-field>
            </v-col>

            <v-col cols="12" lg="5" sm="12" md="5">
              <v-text-field
                v-model="childForm.email"
                label="Email"
                :readonly="isReadOnly"
                maxlength="255"
                @input="updateField('email', $event.target.value)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="childForm.poznamka"
                label="Poznámka"
                :readonly="isReadOnly"
                counter
                maxlength="1000"
                @input="updateField('poznamka', $event.target.value)"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <slot name="actions"></slot>
    </v-card>
  </v-form>
</template>
​
<script>
export default {
  props: {
    editFormData: { type: Object },
    isReadOnly: { type: Boolean, default: false },
    updateEditedItem: {
      type: Function,
      default: () => {},
    },
    editedIndex: { type: Number, default: -1 },
    emitUpdateEditedItem: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['on-submit', 'on-close', 'update:editedItem'],

  data() {
    return {
      localFormData: {},
      childForm: {
        titul: this.editFormData?.titul || null,
        meno: this.editFormData?.meno,
        priezvisko: this.editFormData?.priezvisko,
        rc_ico: this.editFormData?.rc_ico,
        skupina: this.editFormData?.skupina,
        ulica: this.editFormData?.ulica,
        supisne_cislo: this.editFormData?.supisne_cislo,
        mesto: this.editFormData?.mesto,
        psc: this.editFormData?.psc,
        telefon: this.editFormData?.telefon || '+421 ',
        mobil: this.editFormData?.mobil || '+421 ',
        email: this.editFormData?.email,
        poznamka: this.editFormData?.poznamka,
        bd_is_active: this.editFormData?.bd_is_active,
      },
      rules: {
        required: (value) => !!value || 'Toto pole je povinné.',
      },
      aktivna: {
        selected: 1,
        options: [
          { title: 'aktívny', value: 1 },
          { title: 'neaktívny', value: 0 },
        ],
      },
    };
  },
  computed: {
    formTitle() {
      if (this.editedIndex === -2) {
        return `Zobraziť záznam`;
      } else {
        return this.editedIndex === -1 ? 'Nový záznam' : 'Upraviť záznam';
      }
    },
  },

  watch: {
    editFormData: {
      handler(newVal) {
        this.localFormData = {
          ...newVal,
        };
      },
      immediate: true,
    },
  },
  methods: {
    updateField(field, value) {
      if (this.emitUpdateEditedItem) {
        this.$emit('update:editedItem', { field, value });
      } else {
        this.updateEditedItem(field, value);
      }
    },
    async validate() {
      if (this.$refs.form) {
        const { valid } = await this.$refs.form.validate();
        return valid;
      }
      return false;
    },
  },
};
</script>

<style scoped>
* {
  font-family: 'Poppins', sans-serif;
}
</style>
