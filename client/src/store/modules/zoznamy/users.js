import axios from 'axios';
import host from '../../host';
const selectHost = host.state.host;

const users = {
  namespaced: true,
  state: { users: [], selectUsers: [] },
  getters: {
    selectUsers(state) {
      return state.selectUsers;
    },
  },
  mutations: {
    SET_USERS(state, data) {
      const originalUsers = data;
      const partialUsers = originalUsers.map((item) => {
        return { title: item.login, value: item.id };
      });

      state.selectUsers = partialUsers;
    },
  },
  actions: {
    loadUsers({ commit }) {
      axios
        .get(selectHost + '/auth/partial', { withCredentials: true })
        .then((res) => {
          commit('SET_USERS', res.data);
        })
        .catch((error) => console.log(error));
    },
  },
};

export default users;
