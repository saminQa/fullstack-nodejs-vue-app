import axios from 'axios';
import host from '../../host';
const selectHost = host.state.host;

const auta = {
  namespaced: true,
  state: { selectAuta: [] },
  getters: {
    selectAuta(state) {
      return state.selectAuta;
    },
  },
  mutations: {
    SET_AUTA(state, data) {
      state.selectAuta = data;
    },
  },
  actions: {
    loadAuta({ commit }) {
      axios
        .get(selectHost + '/cars/partial', { withCredentials: true })
        .then((res) => {
          commit('SET_AUTA', res.data);
        })
        .catch((error) => console.log(error));
    },
  },
};

export default auta;
