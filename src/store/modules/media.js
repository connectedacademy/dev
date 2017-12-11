import * as types from '@/store/mutation-types'

// initial state
const state = {
  hidden: true,
  playing: false
}

// getters
const getters = {
  mediaHidden: (initialState) => initialState.hidden,
  mediaPlaying: (initialState) => initialState.playing
}

// actions
const actions = {
}

// mutations
const mutations = {
  [types.SHOW_MEDIA](initialState) {
    state.hidden = false
  },  
  [types.HIDE_MEDIA](initialState) {
    state.hidden = true
  },
  [types.PAUSE_MEDIA](initialState) {
    state.playing = false
  },
  [types.PLAY_MEDIA](initialState) {
    state.playing = true
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
