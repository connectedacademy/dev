// initial state
const state = {
  visible: false,
  currentMedia: undefined,
};

// getters
const getters = {
  currentLightboxMedia() {
    return state.currentMedia;
  },
  lightboxVisible() {
    return state.visible;
  },
};

// actions
const actions = {
};

// mutations
const mutations = {
  ['SET_LIGHTBOX_MEDIA'](initialState, media) {
    state.currentMedia = media;
    state.visible = (media !== undefined);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
