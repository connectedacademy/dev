import Router from 'vue-router';

const router = new Router();

// initial state
const state = {
  visible: false,
  authenticating: false,
  isAuthenticated: false,
  user: {
    name: '',
    organisation: '',
  },
};

// getters
const getters = {
};

// actions
const actions = {
};

// mutations
const mutations = {
  login({ commit }) {
    state.visible = true;
  },
  logout({ commit }) {
    state.visible = false;
    state.authenticating = false;
    state.isAuthenticated = false;
    state.user = undefined;
  },
  attemptAuth({ commit }, user) {
    state.user = user;
    document.location = 'http://localhost:4000/auth/login';
  },
  authenticate({ commit }) {
    state.visible = true;
    state.authenticating = true;
    state.isAuthenticated = true;
    setTimeout(() => {
      state.authenticating = false;
      state.isAuthenticated = true;
      state.visible = false;
      router.push('/schedule');
    }, 1000);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
