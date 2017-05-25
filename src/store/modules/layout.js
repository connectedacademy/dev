const COL_STATE_NARROW = 'narrow';
const COL_STATE_WIDE = 'wide';

// initial state
const state = {
  columns: {
    main: {
      state: COL_STATE_WIDE,
    },
  },
};

// getters
const getters = {
};

// actions
const actions = {
  setColumnState({ commit }, colState) {
    state.columns.main.state = colState;
  },
  toggleColumnState({ commit }) {
    if (state.columns.main.state === COL_STATE_NARROW) {
      state.columns.main.state = COL_STATE_WIDE;
    } else {
      state.columns.main.state = COL_STATE_NARROW;
    }
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
