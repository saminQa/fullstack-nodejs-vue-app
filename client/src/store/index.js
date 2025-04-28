import { createStore } from 'vuex';

import users from './modules/zoznamy/users.js';
import poistnici from './modules/zoznamy/poistnici.js';
import host from './host.js';
import authUser from './modules/auth/auth.js';
import auta from './modules/zoznamy/auta.js';

const store = createStore({
  modules: {
    zoznamy: poistnici,
    users,
    authUser,
    auta,
    host,
  },
});

export default store;
