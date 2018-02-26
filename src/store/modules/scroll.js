import Vue from 'vue'
import * as types from '@/store/mutation-types'

// initial state
const state = {
  savedScrollPosition: 0.0,
  currentSection: undefined
}

// getters
const getters = {
  currentSection: (initialState) => initialState.currentSection
}

// actions
const actions = {
  saveScrollPosition({ commit }, scrollPosition) {
    commit(types.SAVE_SCROLL_POSITION, scrollPosition)
  },
  resetState({ commit }) {
    commit(types.RESET_SCROLL_POINTS)
  }
}

// mutations
const mutations = {
  [types.SAVE_SCROLL_POSITION](initialState, scrollPosition) {
    state.savedScrollPosition = scrollPosition
  },
  [types.SET_CURRENT_SECTION](initialState, scrollPoint) {
    state.currentSection = scrollPoint
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
