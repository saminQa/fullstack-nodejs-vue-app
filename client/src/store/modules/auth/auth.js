import host from '../../host';
const selectHost = host.state.host;

let timer;
const authUser = {
  state: {
    //userId: localStorage.getItem('userId') || null,
    userLogin: localStorage.getItem('userLogin') || null,
    sessionExpiration: localStorage.getItem('sessionExpiration') || null,
    didAutoLogout: false,
  },
  getters: {
    userId(state) {
      return state.userId;
    },
    userLogin(state) {
      return state.userLogin;
    },
    isAuthenticated(state) {
      // !! pred vyrazom znamena, ze to premeni na boolean
      return !!state.userLogin;
    },
    didAutoLogout(state) {
      return state.didAutoLogout;
    },
    userRole(state) {
      return state.userRole;
    },
  },
  mutations: {
    SET_USER(state, payload) {
      //state.userId = payload.userId;
      state.userLogin = payload.userLogin;
      state.didAutoLogout = false;
    },
    SET_AUTO_LOG_OUT(state) {
      state.didAutoLogout = true;
    },
    SET_ROLE(state, data) {
      //add your logic here, if you have user roles
      return (state.userRole = 'manager');
    },
  },
  actions: {
    async SIGNIN(context, payload) {
      const response = await fetch(selectHost + '/auth/signin', {
        method: 'POST',
        credentials: 'include',

        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': selectHost,
        },
        body: JSON.stringify({
          login: payload.login,
          heslo: payload.heslo,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(
          responseData.message ||
            responseData.error ||
            'Neautorizovaný prístup - auth.js'
        );

        throw error;
      }

      const expiresIn = 4 * 60 * 60 * 1000; // 4 hodiny
      const expirationDate = new Date().getTime() + expiresIn;
      //localStorage.setItem('userId', responseData.id);
      localStorage.setItem('userLogin', responseData.login);
      localStorage.setItem('sessionExpiration', expirationDate);

      timer = setTimeout(function () {
        context.dispatch('AUTO_LOG_OUT');
      }, expiresIn);

      context.commit('SET_USER', {
        //userId: responseData.id,
        userLogin: responseData.login,
      });
      context.commit('SET_ROLE', responseData.roles);
    },
    async LOG_OUT(context) {
      //localStorage.removeItem('userId');
      localStorage.removeItem('userLogin');
      localStorage.removeItem('sessionExpiration');
      localStorage.removeItem('rola');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.endsWith('_visibleColumns')) {
          localStorage.removeItem(key);
          i--;
        }
      }
      await fetch(selectHost + '/auth/signout', {
        credentials: 'include',
        method: 'POST',
      });

      clearTimeout(timer);

      context.commit('SET_USER', {
        // userId: null,
        userLogin: null,
      });
    },
    AUTO_LOG_OUT(context) {
      context.commit('SET_AUTO_LOG_OUT');
      context.dispatch('LOG_OUT');
    },

    tryLogin(context) {
      //const userId = localStorage.getItem('userId');
      const userLogin = localStorage.getItem('userLogin');
      const sessionExpiration = localStorage.getItem('sessionExpiration');
      const userRole = localStorage.getItem('rola');

      const expiresIn = +sessionExpiration - new Date().getTime();

      if (expiresIn < 0) {
        return;
      }

      timer = setTimeout(function () {
        context.dispatch('AUTO_LOG_OUT');
      }, expiresIn);

      if (userLogin) {
        context.commit('SET_USER', {
          //userId: userId,
          userLogin: userLogin,
        });
        context.commit('SET_ROLE', userRole);
      }
    },
  },
};

export default authUser;

export function hasRole(role, guard) {
  return role.includes(guard);
}
