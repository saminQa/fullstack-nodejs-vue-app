<template>
  <div>
    <ReusableCrudTable
      titulka="Zoznam klientov"
      titulka-icon="people_alt"
      :headers="headers"
      :initial-columns="[
        'rc_ico',
        'titul',
        'meno',
        'priezvisko',
        'ulica',
        'supisne_cislo',
        'mesto',
        'psc',
        'telefon',
        'mobil',
        'email',
        'poznamka',
      ]"
      :column-filters="[
        {
          column: 'priezvisko',
          type: 'text',
          queryParam: 'search_priezvisko',
          placeholder: 'Priezvisko / Názov spoločnosti',
        },
      ]"
      :fetch-items="fetchItems"
      :create-item="createItem"
      :update-item="updateItem"
      :delete-item="deleteItem"
      @update:search="onSearchUpdate"
      ref="ClientsCrudTable"
    >
      <template
        v-slot:form="{ editedItem, updateEditedItem, isReadOnly, editedIndex }"
      >
        <ClientForm
          :edit-form-data="editedItem"
          :update-edited-item="updateEditedItem"
          :is-read-only="isReadOnly"
          :editedIndex="editedIndex"
          ref="formComponent"
        />
      </template>
    </ReusableCrudTable>
  </div>
</template>

<script>
import ReusableCrudTable from '../../components/UI/ReusableCrudTable.vue';
import axios from 'axios';
import ClientForm from '../../components/forms/ClientForm.vue';

export default {
  components: {
    ReusableCrudTable,
    ClientForm,
  },
  data() {
    return {
      headers: [
        { title: 'Akcie', key: 'actions', sortable: false, width: '5%' },
        // { title: 'exp', key: 'data-table-expand' },
        { title: 'ID', key: 'id', sortable: false, width: '4%' },

        { title: 'RČ / IČO', key: 'rc_ico', sortable: false, width: '7%' },
        { title: 'Titul', key: 'titul', sortable: false, width: '4%' },
        {
          title: 'Meno',
          key: 'meno',
          sortable: false,
          width: '5%',
        },
        {
          title: 'Priezvisko',
          key: 'priezvisko',
          sortable: false,
          width: '12%',
        },
        {
          title: 'Ulica',
          key: 'ulica',
          sortable: false,
          width: '9%',
        },
        {
          title: 'Súpisné číslo',
          key: 'supisne_cislo',
          sortable: false,
          width: '5%',
        },
        { title: 'Mesto', key: 'mesto', sortable: false, width: '7%' },
        {
          title: 'PSČ',
          key: 'psc',
          sortable: false,
          width: '5%',
        },
        {
          title: 'Telefón',
          key: 'telefon',
          sortable: false,
          width: '7%',
        },
        { title: 'Mobil', key: 'mobil', sortable: false, width: '7%' },
        { title: 'Email', key: 'email', sortable: false, width: '9%' },

        { title: 'Poznámka', key: 'poznamka', sortable: false, width: '10%' },
      ],

      selectedItem: null,
      itemsPerPage: 50,
      page: 1,
      big_search: '',
      filters: {},
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
  },
  beforeCreate() {
    this.host = this.$store.getters.selectHost;
    this.apiLink = this.host + '/klienti';
  },
};
</script>

<style scoped>
.table-background {
  background-color: var(--modal-background);
}
</style>
