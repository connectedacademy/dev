const BURGER_DEFAULT = 'default';
const BURGER_CLOSE = 'close';

// initial state
const state = {
  debug: true,
  burger: {
    state: BURGER_DEFAULT,
  },
  leftDrawer: {
    visible: false,
  },
};

// getters
const getters = {
};

// actions
const actions = {
  toggleLeftDrawer({ commit }) {
    state.leftDrawer.visible = !state.leftDrawer.visible;
    state.burger.state = (state.leftDrawer.visible) ? BURGER_CLOSE : BURGER_DEFAULT;
  },
  toggleDebugMode({ commit }) {
    state.debug = !state.debug;
  },
};

// mutations
const mutations = {
};

export default {
  state,
  getters,
  actions,
  mutations,
};
