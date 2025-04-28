<template>
  <v-form ref="form" @submit.prevent="$emit('on-submit', childForm)">
    <v-card>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" lg="4" sm="12" md="6">
              <v-text-field
                v-model="childForm.spz"
                label="EČV"
                counter
                maxlength="20"
                :readonly="isReadOnly"
                @input="updateField('spz', $event.target.value)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4" sm="12" md="6">
              <v-text-field
                v-model="childForm.vin"
                label="VIN"
                counter
                maxlength="55"
                hint="Toto pole je povinné"
                persistent-hint
                :rules="[checkDuplicate(childForm.vin), rules.required]"
                :readonly="isReadOnly"
                @input="updateField('vin', $event.target.value)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4" sm="12" md="6">
              <v-select
                v-model="childForm.druh_vozidla"
                label="Druh vozidla"
                :items="selectVozidla"
                item-title="nazov"
                item-value="id"
                :readonly="isReadOnly"
                @update:modelValue="(val) => updateField('druh_vozidla', val)"
              ></v-select>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col cols="12" lg="3" sm="12" md="3">
              <span>Dátum prvej evidencie</span>
              <date-picker
                v-model="childForm.datum_evidencie"
                format="dd.MM.yyyy"
                auto-apply
                inputmode
                :enable-time-picker="false"
                text-input
                :readonly="isReadOnly"
                @input="updateField('datum_evidencie', $event.target.value)"
                @update:modelValue="
                  (val) => updateField('datum_evidencie', val)
                "
              />
            </v-col>
            <v-col cols="12" lg="3" sm="12" md="3" class="pt-4">
              <v-text-field
                v-model="childForm.znacka_vozidla"
                label="Značka"
                counter
                maxlength="255"
                :readonly="isReadOnly"
                @input="updateField('znacka_vozidla', $event.target.value)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="3" sm="12" md="3" class="pt-4">
              <v-text-field
                v-model="childForm.model_vozidla"
                label="Typ"
                counter
                maxlength="255"
                :readonly="isReadOnly"
                @input="updateField('model_vozidla', $event.target.value)"
              ></v-text-field>
            </v-col>

            <v-col cols="12" lg="3" sm="12" md="3" class="pt-4">
              <v-text-field
                v-model="childForm.vykon"
                label="Výkon (kW)"
                maxlength="55"
                :readonly="isReadOnly"
                @input="updateField('vykon', $event.target.value)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row class="pt-3">
            <v-col cols="12" lg="3" sm="12" md="3">
              <v-text-field
                v-model="childForm.objem"
                label="Objem (cm3)"
                maxlength="55"
                :readonly="isReadOnly"
                @input="updateField('objem', $event.target.value)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="3" sm="12" md="3">
              <v-text-field
                v-model="childForm.max_hmotnost"
                label="Najväčšia celková prípustná hmotnosť"
                maxlength="55"
                :readonly="isReadOnly"
                @input="updateField('max_hmotnost', $event.target.value)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="3" sm="12" md="3">
              <v-text-field
                v-model.number="childForm.pocet_sedadiel"
                label="Počet miest na sedenie"
                type="number"
                maxlength="55"
                :readonly="isReadOnly"
                @input="updateField('pocet_sedadiel', $event.target.value)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="3" sm="12" md="3">
              <v-text-field
                v-model="childForm.palivo"
                label="Palivo"
                maxlength="255"
                :readonly="isReadOnly"
                @input="updateField('palivo', $event.target.value)"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="childForm.poznamka"
                label="Poznámka"
                counter
                maxlength="1000"
                :readonly="isReadOnly"
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
import { mapGetters } from 'vuex';
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
        spz: this.editFormData?.spz,
        vin: this.editFormData?.vin,
        druh_vozidla: this.editFormData?.druh_vozidla,
        znacka_vozidla: this.editFormData?.znacka_vozidla,
        model_vozidla: this.editFormData?.model_vozidla,
        datum_evidencie: this.editFormData?.datum_evidencie,
        vykon: this.editFormData?.vykon,
        objem: this.editFormData?.objem,
        max_hmotnost: this.editFormData?.max_hmotnost,
        pocet_sedadiel: this.editFormData?.pocet_sedadiel,
        palivo: this.editFormData?.palivo,
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
      selectVozidla: [
        { nazov: 'osobné', id: 1 },
        { nazov: 'nákladné', id: 2 },
      ],
    };
  },
  computed: {
    ...mapGetters({
      selectAuta: 'auta/selectAuta',
    }),
    formTitle() {
      if (this.editedIndex === -2) {
        return `Zobraziť záznam`;
      } else {
        return this.editedIndex === -1 ? 'Nový záznam' : 'Upraviť záznam';
      }
    },
  },
  created() {
    this.$store.dispatch('auta/loadAuta');
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
      if (field === 'druh_vozidla') {
        value = value ? Number(value) : 99;
      }
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
    checkDuplicate(val) {
      const foundVin = this.selectAuta.find((auto) => auto.vin === val);
      if (foundVin && this.editedIndex === -1) {
        return `VIN "${val}" už existuje pod ŠPZ "${foundVin.spz}". Vyhľadajte ho v zozname áut.`;
      } else {
        return true;
      }
    },
  },
};
</script>
<style scoped>
* {
  font-family: 'Poppins', sans-serif;
}
</style>
