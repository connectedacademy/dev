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
  login() {
    state.visible = true;
  },
  logout() {
    state.visible = false;
    state.authenticating = false;
    state.isAuthenticated = false;
    state.user = undefined;
  },
  attemptAuth(user) {
    state.authenticating = true;
    state.isAuthenticated = true;
    state.user = user;
    setTimeout(() => {
      state.visible = false;
    }, 1000);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
