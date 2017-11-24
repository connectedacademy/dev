import Vue from 'vue'
import * as types from '@/store/mutation-types'

// initial state
const state = {
  scrollPoints: {},
  savedScrollPosition: 0.0,
  currentSection: undefined
}

// getters
const getters = {
  scrollPoints: (initialState) => state.scrollPoints,
  currentSection: (initialState) => state.currentSection
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
  [types.RESET_SCROLL_POINTS](initialState) {
    state.scrollPoints = {}
    state.currentSection = undefined
  },
  [types.SET_SCROLL_POINT](initialState, scrollPoint) {
    Vue.set(state.scrollPoints, scrollPoint.slug, scrollPoint)
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
