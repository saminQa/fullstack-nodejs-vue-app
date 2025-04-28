<template>
  <div>
    <!-- Snackbar for success messages -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="2000"
      location="bottom"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false"> X  </v-btn>
      </template>
    </v-snackbar>

    <v-card style="width: 99%; border: 1px; border-radius: 8px;">
      <v-data-table-server
        :headers="visibleHeaders"
        :items="items"
        :options.sync="options"
        :items-length="Number(totalItems) || 0"
        item-value="id"
        :loading="loading"
        @update:options="fetchData"
        hover
        :items-per-page-options="itemsPerPageOptions"
        show-current-page
        loading-text="Načítavam, prosím čakajte..."
        no-data-text="Nenašli sa žiadne vyhovujúce dáta."
        items-per-page-text="Zobraziť"
        sort-asc-icon="mdi mdi-arrow-up"
        sort-desc-icon="mdi mdi-arrow-down"
        prev-icon="mdi mdi-chevron-left"
        next-icon="mdi-chevron-right"
        last-icon="mdi mdi-chevron-double-right"
        first-icon="mdi mdi-chevron-double-left"
        class="row-height-30 fixed-layout table-background responsive-table"
        @click:row="handleRowClick"
      >
        <template v-slot:top>
          <v-container fluid class="pa-0">
            <v-card
              flat
              class="toolbar-card pa-0"
              style="background: transparent"
            >
              <v-card-text
                style="
                  background: linear-gradient(
                    30deg,
                    var(--dark),
                    var(--primary)
                  );
                "
                class="pa-0 ma-0"
              >
                <v-row>
                  <!-- Title -->
                  <v-col
                    cols="12"
                    sm="6"
                    md="5"
                    lg="6"
                    xl="6"
                    class="pa-0"
                    align-self="start"
                  >
                    <div class="titulka">
                      <span class="material-icons">{{ titulkaIcon }}</span>
                      <div class="titulka-text">{{ titulka }}</div>
                    </div>
                  </v-col>

                  <!-- New Record Button -->
                  <v-col
                    cols="12"
                    sm="6"
                    md="2"
                    lg="2"
                    xl="2"
                    class="d-flex justify-center justify-sm-end"
                  >
                    <v-btn
                      color="var(--dark)"
                      class="tabulka-btn mt-lg-3 mt-md-3 mt-sm-3"
                      size="large"
                      selected-class="tabulka-button"
                      variant="plain"
                      @click="openDialog()"
                    >
                      + Nový záznam
                    </v-btn>
                  </v-col>

                  <!-- Search Field -->
                  <v-col cols="12" sm="9" md="3" lg="3" xl="3" class="mt-lg-3 mt-md-3 tabulka-search-div">
                    <v-text-field
                      v-model="big_search"
                      label="Hľadať"
                      prepend-inner-icon="mdi mdi-magnify"
                      clearable
                      hide-details="auto"
                      variant="outlined"
                      density="compact"
                      class="tabulka-search"
                      clear-icon="mdi-close"
                      bg-color="white"
                      base-color="var(--dark)"
                      @input="debouncedOnSearchInput"
                      @click:clear="fetchData"
                      v-debounce:500="fetchData"
                    ></v-text-field>
                  </v-col>


                  <!-- Column Select -->
                  <v-col cols="12" sm="3" md="2" lg="1" xl="1" class="pr-5 column-select-div">
                    <v-select
                      v-model="selectedColumns"
                      :items="availableColumns"
                      item-text="title"
                      item-value="key"
                      multiple
                      density="compact"
                      hide-details
                      style="width: 90px"
                      menu-icon="mdi-chevron-down"
                      class="column-select mt-lg-3 mb-md-2 float-md-end float-sm-end float-xs-end"
                      suffix="Stĺpce"
                    >
                      <template v-slot:selection="{ item, index }">
                        <p
                          v-if="index === 0"
                          class="text-subtitle-2 pt-lg-2"
                        ></p>
                      </template>
                      <template v-slot:prepend-item>
                        <v-list-item @click="selectAllColumns">
                          <v-btn block flat>Vybrať všetky</v-btn>
                        </v-list-item>
                        <v-divider class="mt-2"></v-divider>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-container>
        </template>
        <template
          v-for="header in visibleHeaders"
          v-slot:[`item.${header.key}`]="{ item }"
        >
          <slot :name="`item.${header.key}`" v-bind:item="item">
            {{ item[header.key] }}
          </slot>
        </template>
        <template v-slot:body.prepend>
   <!-- For Small Screens -->
      <v-menu
      v-if="isSmallScreen"
      v-model="filtersMenu"
      :close-on-content-click=false
      
    >
      <template v-slot:activator="{ props }">
        <v-btn
          block
          v-bind="props"
          class="my-3"
        >
          Filtre
        </v-btn>
      </template>

      <v-card min-width="200">

        <v-list>
          <v-list-item
                v-for="header in columnFilters" :key="header.queryParam"
              >        
            <template v-if="header.type === 'text'">
              <v-text-field
                v-model="filters[header.queryParam]"
                hide-details
                density="comfortable"
                clearable
                clear-icon="mdi-18px mdi-close"
                @input="onFilterInput(header.queryParam)"
                @click:clear="clearFilter(header.queryParam)"
                :placeholder="header.placeholder"
              ></v-text-field>
            </template>
            <template v-else-if="header.type === 'select'">
              <v-select
                v-model="filters[header.queryParam]"
                :items="header.items"
                multiple
                :item-title="header.title"
                :item-value="header.value"
                hide-details
                density="comfortable"
                clearable
                clear-icon="mdi-18px mdi-close"
                menu-icon="mdi-18px mdi mdi-chevron-down"
                @update:modelValue="applyFilters"
                @click:clear="clearFilter(header.queryParam)"
              :placeholder="header.placeholder"
              ></v-select>
            </template>
          
              </v-list-item>
        
        </v-list>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            variant="text"
            @click="filtersMenu = false"
          >
            Zatvoriť
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-menu>
    
   <!-- For Medium and Large Screens -->
          <tr class="filters">
            <td v-for="header in visibleHeaders" :key="header.key">
              <td
                  v-if="header.key === 'actions'"
                  style=" max-width: 75px;"
                >
                  <v-btn density="compact" class="w-50" @click="resetFilters"
                    >Reset</v-btn
                  >
                </td>
              <template v-if="getColumnFilter(header.key)">
                
                <v-text-field
                  v-if="getColumnFilter(header.key).type === 'text'"
                  v-model="filters[getColumnFilter(header.key).queryParam]"
                  hide-details
                  density="compact"
                  clearable
                  clear-icon="mdi-18px mdi-close"
                  @input="onFilterInput(getColumnFilter(header.key).queryParam)"
                  @click:clear="
                    clearFilter(getColumnFilter(header.key).queryParam)
                  "
                  class="th_input"
                ></v-text-field>
                <v-select
                  v-else-if="getColumnFilter(header.key).type === 'select'"
                  v-model="filters[getColumnFilter(header.key).queryParam]"
                  :items="getColumnFilter(header.key).items"
                  multiple
                  :item-title="getColumnFilter(header.key).title"
                  :item-value="getColumnFilter(header.key).value"
                  hide-details
                  density="compact"
                  clearable
                  clear-icon="mdi-18px mdi-close"
                   menu-icon="mdi-18px mdi mdi-chevron-down"
                  @update:modelValue="applyFilters"
                  @click:clear="
                    clearFilter(getColumnFilter(header.key).queryParam)
                  "
                  class="th_input"
                ></v-select>
              </template>
            </td>
          </tr>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon size="small" class="me-2" @click.stop @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="handleDeleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:item="{ item }">
  <tr @click="handleRowClick(item)" :class="'clickable-row'">
    <td
      v-if="selectedColumns.includes('actions') || isActionColumnVisible"
      class="actions"
      data-label="Akcie"
    >
      <v-icon small class="mr-2" @click.stop="editItem(item)">mdi-pencil</v-icon>
      <!-- <v-icon small @click.stop="handleDeleteItem(item)">mdi-delete</v-icon> -->
    </td>
    <td
      v-for="header in visibleHeaders.filter((h) => h.key !== 'actions')"
      :key="header.key"
      :data-label="header.title"
    >
      <slot :name="`item.${header.key}`" :item="item">
        {{ item[header.key] }}
      </slot>
    </td>
  </tr>
</template>
        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pa-2">
            <div class="d-flex align-center">
              <v-select
                v-model="options.itemsPerPage"
                :items="itemsPerPageOptions"
                @change="handleItemsPerPageChange"
                style="max-width: 150px"
                density="compact"
                class="mt-4"
              ></v-select>
              <span class="ml-4">
                Zobrazuje {{ startItem }}-{{ endItem }} z
                {{ totalItems }} záznamov
              </span>
            </div>
            <v-pagination
              v-model="options.page"
              :length="pageCount"
              :total-visible="5"
              @input="handlePageChange"
              rounded="0"
            ></v-pagination>
          </div>
        </template>
      </v-data-table-server>
      <v-dialog v-model="alert.show">
        <v-alert
          v-if="alert.show"
          :type="alert.type"
          :text="alert.message"
          class="custom-alert"
          closable
          @click:close="alert.show = false"
      /></v-dialog>

      <v-dialog v-model="dialog" max-width="1200px">
        <v-card density="compact">
          <v-card-title class="modal-title pa-5 form-titulka">
            <span class="material-icons ">{{ titulkaIcon }}</span>
              <span class="text-h5 mt-2 ml-5" >{{ formTitle }}</span>
 
            
      </v-card-title>
          <!-- <v-container> -->
          <v-card-text class="ma-0 pa-0">
            
            <slot
              name="form"
              :edited-item="editedItem"
              :update-edited-item="updateEditedItem"
              :is-read-only="isReadOnly"
              :editedIndex="editedIndex"
              
  
></slot>
     <!-- v-if="editedIndex > -1" -->        
          </v-card-text>
          <v-card-actions>
            <v-btn
                  color="red-darken-1"
                  variant="text"
                  @click="dialogDelete = true"
                 v-if=" editedIndex > -1"
                >
                  Vymazať záznam
                </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">
              {{ isReadOnly ? 'Zavrieť' : 'Zrušiť' }}
            </v-btn>
            <v-btn
              v-if="!isReadOnly"
              color="blue darken-1"
              variant="flat"
              @click="validateAndSave"
            >
              Uložiť
            </v-btn>
          </v-card-actions>
        <!-- </v-container> -->
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDelete" max-width="600px">
        <v-card>
          <v-card-title class="text-h5"
            >Ste si istý, že chcete vymazať tento záznam?</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1"  variant="flat" @click="closeDelete"
              >Zrušiť</v-btn
            >
            <v-btn color="blue darken-1" text @click="deleteItemConfirm"
              >OK</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default {
  name: 'ReusableCrudTable',
  props: {
    titulka: { type: String, default: 'Záznamy' }, // Table name
    titulkaIcon: {type: String, default: 'table_view'}, //  Table icon - search fonts.google.com -> icons and set  icon name
    headers: {        //  Table headers - [{ title: 'Poznámka', key: 'poznamka', sortable: false, width: '20%' }],
      type: Array,
      required: true,   
    },
    initialColumns: {     // What columns to start with, just array of strings - select from  headers[key]
      type: Array,
      default: () => [], // if empty, all columns will be shown
    },
    columnFilters: { //"[ {column: 'string from headers[key]',type: 'select/text',queryParam: 'query param from B-E', items: items to inhabit the select menu with, title: 'if returned data else as title and value', value: 'if returned data else as title and value' },{ column: 'string', type: 'text', queryParam: 'search_ulica' },]"
      type: Array,
      default: () => [],
    },
    fetchItems: {
      type: Function,
      required: true,
    },
    createItem: {
      type: Function,
      required: true,
    },
    updateItem: {
      type: Function,
      required: true,
    },
    deleteItem: { type: Function, required: true },
  },
  provide() {
    return { editedIndex: this.editedIndex };
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
      items: [],
      selectedColumns: [],
      availableColumns: [],
      isActionColumnVisible: true,
      isReadOnly: false,
      itemsPerPageOptions: [10, 25, 50, 100, 500],
      totalItems: 0,
      loading: false,
      options: {
        page: 1,
        itemsPerPage: 50,
        big_search: '',
        sortBy: [],
        sortDesc: [],
      },
      big_search: '',
      filters: {},
      debouncedApplyFilters: null,
      filterTimeout: null,
      debouncedOnSearchInput: debounce(this.onSearchInput, 300),
      // ---- ERROR HANDLING ----
      alert: {
        show: false,
        type: 'error',
        message: '',
      },
      snackbar: {
        show: false,
        color: 'success',
        message: '',
      },
      screenWidth: window.innerWidth,
     
      filtersMenu: false,
      
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
    pageCount() {
      return Math.ceil(this.totalItems / this.options.itemsPerPage);
    },
    startItem() {
      return (this.options.page - 1) * this.options.itemsPerPage + 1;
    },
    endItem() {
      const end = this.options.page * this.options.itemsPerPage;
      return end > this.totalItems ? this.totalItems : end;
    },
    visibleHeaders() {
      return this.headers.filter(
        (header) =>
          this.selectedColumns.includes(header.key) ||
          (header.key === 'actions' && this.isActionColumnVisible)
      );
    },
    isSmallScreen() {
    return this.screenWidth <= 768;
  },
  userRole() {
      return this.$store.getters.userRole;
    },

  },

  methods: {
    async fetchData() {
      this.loading = true;
      const params = {};
      try {
        const { items, total } = await this.fetchItems({
          page: this.options.page,
          itemsPerPage: this.options.itemsPerPage,
          sortBy: this.options.sortBy,
          sortDesc: this.options.sortDesc,
          big_search: this.big_search,
          ...this.filters,
        });

        this.items = items;
        this.totalItems = Number(total) || 0;
      } catch (error) {
        console.error('Chyba pri načítavaní dát:', error);
        this.items = [];
        this.totalItems = 0;
      } finally {
        this.loading = false;
      }
    },
    getColumnFilter(columnKey) {
      return this.columnFilters.find((filter) => filter.column === columnKey);
    },
    onFilterInput(queryParam) {
      clearTimeout(this.filterTimeout);
      this.filterTimeout = setTimeout(() => {
        this.applyFilters();
      }, 300);
    },
    applyFilters() {
      this.options.page = 1;
      this.fetchData();
    },
    clearFilter(key) {
      delete this.filters[key];

      this.applyFilters();
    },
    resetFilters() {
      this.filters = {};
      this.big_search='',
      this.showSuccess('Vyhľadávanie vymazané.');
      this.applyFilters();
      
    },

    handlePageChange(page) {
      this.options.page = page;
      this.fetchData();
    },

    handleItemsPerPageChange(itemsPerPage) {
      this.options.itemsPerPage = itemsPerPage;
      this.options.page = 1;
      this.fetchData();
    },

    openDialog() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.isReadOnly = false;
      });
      setTimeout(() => {
        this.editedIndex = -1;
      }, 300);
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    async validateAndSave() {
      try {
        // Instead of emitting, we'll wait for the validation result
        const valid = await this.$parent.$refs.formComponent.validate();

        if (valid) {
          await this.save();
        } else {
          this.showError({ message: 'Prosím vyplňte všetky povinné polia.' });
        }
      } catch (error) {
        console.error('Validation error:', error);
        this.showError({ message: 'Chyba pri validácii formulára.' });
      }
    },

    async save() {
      try {
        if (this.editedIndex > -1) {
          // Update
          await this.updateItem(this.editedItem);
          this.showSuccess('Záznam bol úspešne upravený');
        } else {
          // Create
          await this.createItem(this.editedItem);
          this.showSuccess('Záznam bol úspešne vytvorený');
        }
        await this.fetchData(); // Refresh the table
        this.close();
      } catch (error) {
        console.error('Nastala chyba pri ukladaní záznamu:', error);
        this.showError(error);
      }
    },

    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.isReadOnly = false;
      this.openDialog();
    },

    updateEditedItem(field, value) {
      this.editedItem = {
        ...this.editedItem,
        [field]: value,
      };
    },

    handleRowClick(item) {
      if (item) {
        this.editedIndex = -2;
        this.isReadOnly = true;
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      } else {
        console.error(
          'Nenašli sa žiadne položky pomocou metódy handleRowClick'
        );
      }
    },
    handleDeleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    async deleteItemConfirm() {
      try {
        await this.deleteItem(this.editedItem);
        this.showSuccess('Záznam bol úspešne vymazaný');
        await this.fetchData(); // Refresh the table
        this.closeDelete();
        this.close();
      } catch (error) {
        console.error('Chyba pri vymazávaní:', error);
        this.showError(error);
      }
    },
    onSearchInput() {
      this.$emit('update:search', this.big_search);
      this.fetchData();
    },

    // -------------- DYNAMICALLY RENDER COLUMNS ------------------

    initializeColumns() {
      // Get all headers except actions
      this.availableColumns = this.headers
        .filter((header) => header.key !== 'actions')
        .map((header) => ({
          title: header.title,
          key: header.key,
        }));
      const storedColumns = JSON.parse(
        localStorage.getItem(`${this.titulka}_visibleColumns`)
      );

      // Check if storedColumns is valid (not null and is an array)
      if (Array.isArray(storedColumns) && storedColumns.length > 0) {
        // Use stored columns if they exist and are valid
        this.selectedColumns = storedColumns;
      } else if (!storedColumns && this.initialColumns.length > 0) {
        // If no stored columns, use initial columns from parent if provided
        this.selectedColumns = this.initialColumns;
      } else {
        // If no stored or initial columns, default to showing all columns except 'actions'
        this.selectedColumns = this.headers
          .filter((header) => header.key !== 'actions')
          .map((header) => header.key);
      }
    },
    saveColumnSelection() {
      localStorage.setItem(
        `${this.titulka}_visibleColumns`,
        JSON.stringify(this.selectedColumns)
      );
    },
    handleColumnSelectionChange() {
      this.saveColumnSelection();
    },

    selectAllColumns() {
      this.selectedColumns = this.availableColumns.map((column) => column.key);
    },

    // ----------------- ERROR HANDLING ---------------
    showSuccess(message) {
      this.snackbar = {
        show: true,
        color: 'success',
        message: message,
      };
    },

    showError(error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Nastala neočakávaná chyba';
      this.alert = {
        show: true,
        type: 'error',
        message: errorMessage,
      };
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
  },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.fetchData();
    this.initializeColumns();
  
  
},

beforeDestroy() {
  window.removeEventListener('resize', this.handleResize);

  },
  created() {
    this.debouncedOnSearchInput = debounce(this.onSearchInput, 300);
    this.debouncedApplyFilters = debounce(this.applyFilters, 300);
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    options: {
      handler() {
        this.fetchData();
      },
      deep: true,
    },
    selectedColumns() {
      this.saveColumnSelection();
    },
    headers: {
      immediate: true,
      handler() {
        this.initializeColumns();
        
      },
    },
    
  },
};
</script>

<style scoped>
 .responsive-table :deep(td) {
  overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;

  }
.responsive-table :deep(td.actions) {
  overflow: visible;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.3s;
}

.clickable-row:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.material-icons {
  font-size: 40px;
}

.column-select {
  max-width: 200px;
  height: 30px !important;
}
.column-select :deep(.v-field__input) {
  min-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.column-select :deep(.v-field__append-inner) {
  align-self: center;
}

.toolbar-card {
  background: linear-gradient(30deg, var(--dark), var(--primary));
  height: 70px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.titulka {
  display: flex;
  align-items: center;
  padding: 0 0 16px 3%;
  
}

.form-titulka {
  display: flex;
  /* padding: 3% 0 0 3%; */
  
}

.titulka-text {
  margin: 0 0 0 8px;
  font-family: 'Poppins', sans-serif !important;
  font-size: 1.8rem;
}

@media (max-width: 1100px) {
  .column-select {
    max-width: 100%;
  }
}

@media (max-width: 960px) {
  .tabulka-search {
    padding-left: 16px;
  }
    .toolbar-card {
      
    height: 100%;
    padding: 30px;
  
  }
  .tabulka-search-div {
    padding: 0 0 30px 5px;
    
  }
  .titulka {
    padding-bottom:0;
    height: 60px;
  }
  /* .column-select {
    padding-bottom: 12px;
  } */
}
/* Media query for medium to small screens */
@media (max-width: 768px) {
  /* Hide table headers on mobile */
  .responsive-table :deep(thead) {
    display: none;
  }

  /* Convert rows to card-like elements */
  .responsive-table :deep(tr) {
    display: block;
    background-color: beige;
    margin-bottom: 1rem;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    padding: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* Style individual cells */
  .responsive-table :deep(td) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  /* Add labels for each cell */
  .responsive-table :deep(td::before) {
    content: attr(data-label);
    font-weight: bold;
    width: 40%;
    min-width: 120px;
    padding-right: 1rem;
  }

  .responsive-table :deep(td.actions::before) {
    width:100%;
  }

  /* Style the content area of each cell */
  .responsive-table :deep(td > *) {
    width: 60%;
  }

  /* Actions column specific styling */
  .responsive-table :deep(td.actions) {
    justify-content: flex-end;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
  }
  .responsive-table :deep(td.actions i) {
    width:10%
  }
  .responsive-table :deep(tr.filters) {
   display: none;
  }
.column-select-div{padding: 0;
margin:0}

}

@media (max-width: 599px) {
  .titulka {
    justify-content: center;
    padding: 0;
    margin: 20px 0 0 0;
  }

  .toolbar-card {
    padding: 16px 0;
    height: 100%;
  }
  .tabulka-search-div {
    padding: 0;
  }
  .tabulka-search {
    max-width: 98%;
    padding: 0 2% 0 4%;
  }
  .column-select-div {
    padding: 10px 0 30px 0;
  }
  .column-select {
    float: right;;
  }
  .tabulka-btn {
    margin-top: 0;
  }
  .v-col {
    padding: 8px 16px !important;
  }
}

/* .column-select.v-input__control {
  height: 50px;
} */

.custom-alert {
  position: fixed !important;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  min-width: 300px;
  max-width: 600px;
}

/* Base table styles */
.responsive-table {
  width: 100%;
}


</style>
