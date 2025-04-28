import { createApp } from 'vue';
import { vue3Debounce } from 'vue-debounce';
import App from './App.vue';

import router from './router/router.js';
import store from './store/index.js';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

//Date Picker
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

// Icons
import { fa } from 'vuetify/iconsets/fa';
import { md } from 'vuetify/iconsets/md';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    iconfonts: 'mdi',
    values: {
      dropdown: 'mdi-chevron-down',
    },
    aliases,
    sets: {
      mdi,
      fa,
      md,
    },
  },
});
// Global components

import ClientForm from './components/forms/ClientForm.vue';
import AutoForm from './components/forms/AutoForm.vue';

const app = createApp(App);

app.use(router);
app.use(store);
app.use(vuetify);

app.component('date-picker', VueDatePicker);
app.component('client-form', ClientForm);
app.component('auto-form', AutoForm);

app.directive('debounce', vue3Debounce({ lock: true })).mount('#app');
