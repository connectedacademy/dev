import Vue from 'vue'
import * as types from '@/store/mutation-types'

// initial state
const state = {
  savedScrollPosition: 0.0
}

// getters
const getters = {
}

// actions
const actions = {
  saveScrollPosition({ commit }, scrollPosition) {
    commit(types.SAVE_SCROLL_POSITION, scrollPosition)
  }
}

// mutations
const mutations = {
  [types.SAVE_SCROLL_POSITION](initialState, scrollPosition) {
    state.savedScrollPosition = scrollPosition
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
