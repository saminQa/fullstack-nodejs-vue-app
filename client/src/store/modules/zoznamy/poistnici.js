import axios from 'axios';
import host from '../../host';
const selectHost = host.state.host;

const poistnici = {
  namespaced: true,
  state: { selectPoistnici: [] },
  getters: {
    selectPoistnici(state) {
      return state.selectPoistnici;
    },
  },
  mutations: {
    SET_POISTNICI(state, data) {
      state.selectPoistnici = data;
    },
  },
  actions: {
    async loadPoistnici({ commit }) {
      await axios
        .get(`${selectHost}/klienti/partial`, {
          withCredentials: true,
        })
        .then((res) => {
          commit('SET_POISTNICI', res.data[0]);
        })
        .catch((error) => console.log(error));
    },
  },
};

export default poistnici;
