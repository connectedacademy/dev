import * as types from '../mutation-types';
import API from '../../api';

// initial state
const state = {
  visible: false,
  authenticating: false,
  isAuthenticated: false,
  session: {
    sid: '',
  },
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
  checkAuth({
    commit,
  }) {
    API.auth.checkAuth(
      response => commit(types.CHECK_AUTH_SUCCESS, {
        response,
      }),
      response => commit(types.CHECK_AUTH_FAILURE, {
        response,
      }),
    );
  },
  logout({
    commit,
  }) {
    API.auth.logout(
      response => commit(types.LOGOUT_SUCCESS, { response }),
      response => commit(types.LOGOUT_FAILURE, { response }),
    );
  },
};

// mutations
const mutations = {
  [types.CHECK_AUTH_SUCCESS](initialState, {
    response,
  }) {
    state.isAuthenticated = true;
    // Save user in session
    state.user = response.user;
  },
  [types.CHECK_AUTH_FAILURE](initialState, {
    response,
  }) {
    state.isAuthenticated = false;
    // error in response
  },
  [types.LOGOUT_SUCCESS](initialState, {
    response,
  }) {
    state.visible = false;
    state.authenticating = false;
    state.isAuthenticated = false;
    state.user = undefined;
  },
  [types.LOGOUT_FAILURE](initialState, {
    response,
  }) {
    // error in response
  },
  login({ commit }) {
    state.visible = true;
  },
  setSession({ commit }, session) {
    state.session = session;
  },
  attemptAuth({ commit }, user) {
    state.user = user;
    document.location = 'http://localhost:4000/auth/login';
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
