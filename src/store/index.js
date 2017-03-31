import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    auth: {
      visible: false,
      authenticating: false,
      isAuthenticated: false,
      user: {
        name: '',
        organisation: '',
      },
    },
    layout: {
      columns: {
        main: {
          state: 'wide',
        },
      },
    },
    navigation: {
      burger: {
        state: 'open',
      },
      leftDrawer: {
        visible: false,
      },
    },
  },
  getters: {
    // columnMainState: (state) => {
    //   return state.layout.columns.main.state;
    // },
    // width: (state) => {
    //   const value = state.layout.columns.main.width;
    //   return `${value}px`;
    // },
  },
  mutations: {
    login(state) {
      state.auth.visible = true;
    },
    logout(state) {
      state.auth.visible = false;
      state.auth.authenticating = false;
      state.auth.isAuthenticated = false;
      state.auth.user = undefined;
    },
    attemptAuth(state, user) {
      state.auth.authenticating = true;
      state.auth.isAuthenticated = true;
      state.auth.user = user;
      setTimeout(() => {
        state.auth.visible = false;
      }, 2000);
    },
    toggleLeftDrawer(state) {
      state.navigation.leftDrawer.visible = !state.navigation.leftDrawer.visible;
      state.navigation.burger.state = (state.navigation.leftDrawer.visible) ? 'close' : 'default';
    },
    setColumnState(state, newState) {
      state.layout.columns.main.state = newState;
    },
    toggleColumnState(state) {
      state.layout.columns.main.state = (state.layout.columns.main.state === 'narrow') ? 'wide' : 'narrow';
    },
  },
});
