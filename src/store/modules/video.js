// initial state
const state = {
  playing: false,
};

// getters
const getters = {
  mediaPlaying() {
    return state.playing;
  },
};

// actions
const actions = {
};

// mutations
const mutations = {
  ['PAUSE_MEDIA'](initialState) {
    state.playing = false;
  },
  ['PLAY_MEDIA'](initialState) {
    state.playing = true;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
