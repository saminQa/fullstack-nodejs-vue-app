const host = {
  state: { host: 'http://localhost:3001' }, //  add your back-end port
  getters: {
    selectHost(state) {
      return state.host;
    },
  },
  actions: {
    SET_HOST() {
      return selectHost;
    },
  },
};

export default host;
