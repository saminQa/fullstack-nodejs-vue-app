<template>
  <div class="app">
    <!-- SIDEBAR -->
    <the-sidebar v-if="!$route.path.includes('login')"></the-sidebar>
    <v-row>
      <nav-bar v-if="!$route.path.includes('login')"></nav-bar>
      <!-- CONTENT -->

      <router-view class="main"></router-view>
    </v-row>
  </div>
</template>

<script setup>
import TheSidebar from './components/layout/TheSidebar.vue';
import NavBar from './components/layout/NavBar.vue';
</script>
<script>
export default {
  computed: {
    didAutoLogout() {
      return this.$store.getters.didAutoLogout;
    },
  },
  created() {
    this.$store.dispatch('tryLogin');
  },
  watch: {
    didAutoLogout(curValue, oldValue) {
      if (curValue && curValue !== oldValue) {
        this.$router.replace('/login');
      }
    },
  },
};
</script>

<style lang="scss">
@import 'https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700';

:root {
  --primary: #48c4dad2;
  --primary-alt: #22c55e;
  --grey: #64748b;
  --dark: #1e293b;
  --dark-alt: #334155;
  --light: #f1f5f9;
  --sidebar-width: 230px;
  --background: #d4cece;
  --modal-background: #f1f1e3;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  // background: var(--light);
  font-family: 'Fira sans', sans-serif;
}
html {
  background-color: var(--modal-background);
}

table {
  font-family: 'Poppins', sans-serif !important;
  width: 100% !important;
  font-size: 12px !important;
  font-weight: 500;
  //color: black;
  z-index: -10;
}

.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem;
  margin: 1rem;
  width: fit-content;
}
button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}
.app {
  display: flex;
  .main {
    flex: 1 1 auto;
    max-width: 100%;
    position: absolute;
    margin: 40px 0 0 1%;
    padding-left: 1%;
    max-width: 100%;
    margin: 120px 0 0 1%;

    // padding-right: 2%;
    @media (max-width: 1325px) {
    }
  }
}

ul {
  list-style: none;
}
.v-data-table {
  table-layout: fixed;
}

.v-data-table-header__content {
  font-weight: bold;
  table-layout: fixed;
}

.v-data-table.row-height-30 td {
  height: 30px !important;
}

.v-data-table__tr:hover {
  background: #9cd5f0;
}
.v-card {
  background-color: var(--modal-background);
}
.titulka {
  font-size: 2rem;
  height: 80px;
  color: var(--light);
  margin: 15px 0 0 20px;

  overflow: inherit;

  @media (max-width: 1080px) {
    font-size: 1.5rem;
  }
}
.titulka-text {
  display: inline-block;
  margin: 15px 0 0 7px;
}

.tabulka-btn {
  margin: 35px 0px 0 10px;
  font-family: 'Poppins', sans-serif;

  :hover {
    color: var(--light);
    font-size: x-large;
    transition: 0.2s ease-out;
  }
  // }
}

.tab-toolbar {
  background: linear-gradient(30deg, var(--dark), var(--primary));
}

.modal-title {
  background: linear-gradient(10deg, var(--primary), var(--dark));
}

.form-window {
  width: 90%;
}

.th_input .v-text-field input {
  font-size: 12px;
  padding-left: 2%;
  max-width: 100%;
}

.th_input {
  .v-field {
    font-size: 12px !important;
    --v-field-padding-start: 1px !important;
  }
  .v-icon {
    --v-icon-size-multiplier: 0.5 !important;
  }
}
.v-field--appended {
  padding-inline-end: 0 !important;
}

.v-table__wrapper table {
  table-layout: fixed;
}

td.v-data-table__td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.zorh4 {
  color: #0f4295;
  font-family: 'Poppins';
  padding-bottom: 2%;
}

.zorh5 {
  font-family: 'Poppins';
}

.zor-blue-div {
  background-color: #7ecff5;
}
</style>
