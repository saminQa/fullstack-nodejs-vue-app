<template>
  <div>
    <ReusableCrudTable
      titulka="Zoznam vozidiel"
      titulka-icon="commute"
      :headers="headers"
      :initial-columns="[
        'spz',
        'vin',
        'druh_vozidla',
        'znacka_vozidla',
        'model_vozidla',
        'datum_evidencie',
        'max_hmotnost',
        'vykon',
        'objem',
        'palivo',
      ]"
      :column-filters="[
        {
          column: 'spz',
          type: 'text',
          queryParam: 'search_spz',
          placeholder: 'EČV',
        },
        {
          column: 'vin',
          type: 'text',
          queryParam: 'search_vin',
          placeholder: 'VIN',
        },
      ]"
      :fetch-items="fetchItems"
      :create-item="createItem"
      :update-item="updateItem"
      :delete-item="deleteItem"
      @update:search="onSearchUpdate"
      ref="CarsCrudTable"
    >
      <template
        v-slot:form="{ editedItem, updateEditedItem, isReadOnly, editedIndex }"
      >
        <AutoForm
          :edit-form-data="editedItem"
          :update-edited-item="updateEditedItem"
          :is-read-only="isReadOnly"
          :editedIndex="editedIndex"
          ref="formComponent"
        />
      </template>

      <!-- Custom template for the druh_vozidla column -->
      <template v-slot:item.druh_vozidla="{ item }">
        {{ druhVozidlaTabulka(item.druh_vozidla) }}
      </template>
      <!-- Custom template for the date column -->
      <template v-slot:item.datum_evidencie="{ item }">
        {{ formatDate(item.datum_evidencie) }}
      </template>
    </ReusableCrudTable>
  </div>
</template>

<script>
import ReusableCrudTable from '../../components/UI/ReusableCrudTable.vue';
import axios from 'axios';
import AutoForm from '../../components/forms/AutoForm.vue';

export default {
  components: {
    ReusableCrudTable,
    AutoForm,
  },
  data() {
    return {
      headers: [
        { title: 'Akcie', key: 'actions', sortable: false, width: '8%' },
        // { title: 'exp', key: 'data-table-expand' },
        { title: 'ID', key: 'id', sortable: false, width: '4%' },
        { title: 'EČV', key: 'spz', sortable: false, width: '10%' },
        { title: 'VIN', key: 'vin', sortable: false, width: '10%' },
        { title: 'Druh', key: 'druh_vozidla', sortable: false, width: '8%' },
        {
          title: 'Značka',
          key: 'znacka_vozidla',
          sortable: false,
          width: '8%',
        },
        { title: 'Typ', key: 'model_vozidla', sortable: false, width: '8%' },
        {
          title: 'Dátum 1. evidencie',
          key: 'datum_evidencie',
          sortable: false,
          width: '7%',
        },
        { title: 'Výkon (kW)', key: 'vykon', sortable: false, width: '5%' },
        { title: 'Objem (cm3)', key: 'objem', sortable: false, width: '5%' },
        {
          title: 'Najväčšia celková prípustná hmotnosť',
          key: 'max_hmotnost',
          sortable: false,
          width: '8%',
        },
        {
          title: ' Počet miest na sedenie',
          key: 'pocet_sedadiel',
          sortable: false,
          width: '8%',
        },
        { title: 'Palivo', key: 'palivo', sortable: false, width: '8%' },
        // { title: 'Aktívny', key: 'bd_is_active', sortable: false, width: '5%' },

        { title: 'Poznámka', key: 'poznamka', sortable: false, width: '15%' },
      ],

      selectedItem: null,
      itemsPerPage: 50,
      page: 1,
      big_search: '',
      filters: {},
      selectVozidla: [
        { nazov: 'osobné', id: 1 },
        { nazov: 'nákladné', id: 2 },
      ],
    };
  },

  methods: {
    async fetchItems({
      page,
      itemsPerPage,
      big_search,
      sortBy,
      sortDesc,
      ...filters
    }) {
      try {
        const response = await axios.get(`${this.apiLink}`, {
          params: {
            page: page,
            take: itemsPerPage,
            big_search: big_search,

            // sortBy: sortBy.length > 0 ? sortBy[0] : null,
            //sortDesc: sortDesc.length > 0 ? sortDesc[0] : null,
            ...filters,
          },
          withCredentials: true,
        });
        const [items, total] = response.data;

        return {
          items: items, // the first element (array of items)
          total: total, // the second element (number)
        };
      } catch (error) {
        console.error('Chyba pri načítavaní dát:', error);
        alert('Neautorizovaný prístup. Prosím, prihláste sa.');
        return { items: [], total: 0 };
      }
    },
    onSearchUpdate(newSearch) {
      this.big_search = newSearch;
    },
    async validateForm() {
      const formComponent = this.$refs.formComponent;
      if (formComponent && typeof formComponent.validate === 'function') {
        return await formComponent.validate();
      }
      return false;
    },
    async createItem(item) {
      const response = await axios.post(`${this.apiLink}`, item, {
        withCredentials: true,
      });
      await this.fetchItems({ page: 1 });
      return response.data;
    },

    async updateItem(item) {
      const response = await axios.patch(`${this.apiLink}/${item.id}`, item, {
        withCredentials: true,
      });
      return response.data;
    },

    async deleteItem(item) {
      const response = await axios.delete(`${this.apiLink}/${item.id}`, {
        withCredentials: true,
      });
      return response.data;
    },
    formatDate(date) {
      const datum = new Date(date).toLocaleDateString('sk-SK');

      if (!date) {
        return null;
      } else {
        return datum;
      }
    },

    druhVozidlaTabulka(item) {
      const vozidla = this.selectVozidla.find((x) => x.id === item);

      if (vozidla) {
        return vozidla.nazov;
      } else {
        return null;
      }
    },
  },
  beforeCreate() {
    this.host = this.$store.getters.selectHost;
    this.apiLink = this.host + '/cars';
  },
};
</script>

<style>
.table-background {
  background-color: var(--modal-background);
}
</style>
