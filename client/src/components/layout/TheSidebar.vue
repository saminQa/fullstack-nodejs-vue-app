<template>
  <aside :class="`${is_expanded ? 'is-expanded' : ''}`">
    <div class="logo">
      <img src="../../assets/logo1.png" alt="logo" />
    </div>
    <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="toggleMenu">
        <span class="material-icons"> keyboard_double_arrow_right</span>
      </button>
    </div>
    <h3>Menu</h3>
    <div class="menu">
      <router-link class="button" to="/home">
        <span class="material-icons">home</span>
        <span class="text">Domov</span>
      </router-link>
      <router-link class="button" to="/about">
        <span class="material-icons">visibility</span>
        <span class="text">Prehľad</span>
      </router-link>

      <router-link class="button" to="/klienti">
        <span class="material-icons">manage_accounts</span>
        <span class="text">Klienti</span>
      </router-link>
      <router-link class="button" to="/auta">
        <span class="material-icons">commute</span>
        <span class="text">Vozidlá</span>
      </router-link>

      <router-link class="button" to="/users">
        <span class="material-icons">list</span>
        <span class="text">Používatelia</span>
      </router-link>
    </div>

    <div class="flex"></div>
    <div class="menu">
      <router-link class="button" to="/settings">
        <span class="material-icons">settings</span>
        <span class="text">Nastavenie</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// is_expanded do is-expanded dynamic class
const is_expanded = ref(localStorage.getItem('is_expanded') === 'true');
const toggleMenu = () => {
  is_expanded.value = !is_expanded.value;
  localStorage.setItem('is_expanded', is_expanded.value);
};
</script>

<style lang="scss" scoped>
aside {
  display: flex;
  flex-direction: column;

  width: calc(2rem + 2rem);
  overflow: hidden;
  min-height: 100vh;
  padding: 1rem;
  font-family: 'Fira sans', sans-serif;

  background-color: var(--dark);
  color: var(--light);
  position: relative;
  z-index: 99;
  transition: 0.2s ease-out;

  .flex {
    flex: 1 1 0;
  }
  .logo {
    margin-bottom: 1rem;

    img {
      width: 11rem;
      transition: 0.2s ease-out;
      margin-left: -8.8rem;
    }
  }

  .menu-toggle-wrap {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;

    position: relative;
    top: 0;
    transition: 0.2s ease-out;

    .menu-toggle {
      transition: 0.2s ease-out;

      .material-icons {
        font-size: 2rem;
        color: var(--light);
        transition: 0.2s ease-out;
      }

      &:hover {
        .material-icons {
          color: var(--primary);
          transform: translateX(0.5rem);
        }
      }
    }
  }

  h3,
  .button .text {
    opacity: 0;
    transition: 0.3s ease-out;
  }

  h3 {
    color: var(--grey);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }
  .menu {
    margin: 0 -1rem;

    .button {
      display: flex;
      align-items: center;
      text-decoration: none;

      padding: 0.5rem 1rem;
      transition: 0.2s ease-out;

      .material-icons {
        font-size: 2rem;
        color: var(--light);
        transition: 0.2s ease-out;
      }

      .text {
        color: var(--light);
        transition: 0.2s ease-out;
      }

      &:hover,
      &.router-link-active {
        background-color: var(--dark-alt);

        .material-icons,
        .text {
          color: var(--primary);
        }
      }

      &.router-link-active {
        border-right: 5px solid var(--primary);
      }
    }
  }

  &.is-expanded {
    width: var(--sidebar-width);

    .menu-toggle-wrap {
      top: -1rem;

      .menu-toggle {
        transform: rotate(-180deg);
      }
    }

    h3,
    .button .text {
      opacity: 1;
    }

    .button {
      .material-icons {
        margin-right: 1rem;
      }
    }

    .logo {
      img {
        width: 12rem;
        margin-left: 0;
        transition: 0.2s ease-out;
      }
    }
  }

  // @media (max-width: 1325px) {
  //   width: calc(2rem + 2rem);
  // }
}
</style>
