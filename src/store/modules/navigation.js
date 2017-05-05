import * as types from '../mutation-types';

const BURGER_DEFAULT = 'default';
const BURGER_CLOSE = 'close';

// initial state
const state = {
  overlayVisible: false,
  videoEnabled: true,
  visible: true,
  burger: {
    state: BURGER_DEFAULT,
  },
  leftDrawer: {
    visible: false,
  },
  rightDrawer: {
    visible: false,
  },
};

// getters
const getters = {
  videoEnabled() {
    return state.videoEnabled;
  },
};

// actions
const actions = {
};

// mutations
const mutations = {
  [types.TOGGLE_VIDEO](initialState) {
    state.videoEnabled = !state.videoEnabled;
  },
  [types.TOGGLE_DEBUG_MODE](initialState) {
    state.debug = !state.debug;
  },
  [types.TOGGLE_LEFT_DRAWER](initialState) {
    state.leftDrawer.visible = !state.leftDrawer.visible;
    state.overlayVisible = state.leftDrawer.visible;
    state.burger.state = (state.leftDrawer.visible) ? BURGER_CLOSE : BURGER_DEFAULT;
  },
  [types.TOGGLE_RIGHT_DRAWER](initialState) {
    state.rightDrawer.visible = !state.rightDrawer.visible;
    state.overlayVisible = state.rightDrawer.visible;
  },
  [types.DISMISS_LEFT_DRAWER](initialState) {
    state.leftDrawer.visible = false;
    state.overlayVisible = false;
    state.burger.state = BURGER_DEFAULT;
  },
  [types.DISMISS_RIGHT_DRAWER](initialState) {
    state.rightDrawer.visible = false;
    state.overlayVisible = false;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
