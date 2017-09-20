// initial state
const state = {
  playing: false,
  position: 0.0,
  duration: undefined,
};

// getters
const getters = {
  videoPlaying() {
    return state.playing;
  },
  videoPosition() {
    return state.position;
  },
  videoDuration() {
    return state.duration;
  },
};

// actions
const actions = {
};

// mutations
const mutations = {
  ['PAUSE_VIDEO'](initialState) {
    state.playing = false;
  },
  ['PLAY_VIDEO'](initialState) {
    state.playing = true;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
