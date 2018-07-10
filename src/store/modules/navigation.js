import * as types from '@/store/mutation-types'
import forEach from 'lodash/forEach'

const BURGER_DEFAULT = 'default'
const BURGER_CLOSE = 'close'

// initial state
const state = {
  overlayVisible: false,
  visible: false,
  minimized: true,
  burger: {
    state: BURGER_DEFAULT
  },
  leftDrawer: {
    visible: false
  },
  rightDrawer: {
    visible: false
  },
  pageStyles: undefined
}

// getters
const getters = {
  navigation() {
    return state
  },
  pageStyles() {
    return state.pageStyles
  }
}

// actions
const actions = {
  dismissDrawers({ commit }) {
    commit('DISMISS_DRAWERS')
  },
  dismissOverlay({ commit }) {
    commit('DISMISS_AUTH')
    commit('DISMISS_INFO_MODAL')
    commit('DISMISS_QUESTION_MODAL')
    commit('DISMISS_MEDIA_UPLOAD_MODAL')
    commit('DISMISS_LEFT_DRAWER')
    commit('DISMISS_RIGHT_DRAWER')
    commit('DISMISS_PROFILE_ACTION')
  }
}

// mutations
const mutations = {
  [types.SET_PAGE_STYLE](initialState, newState) {
    state.pageStyles = newState
  },
  [types.SET_NAV_STATE](initialState, newState) {
    forEach(newState, function(value, key) {
      state[key] = value
    })
  },
  [types.TOGGLE_LEFT_DRAWER](initialState) {
    state.leftDrawer.visible = !state.leftDrawer.visible
    state.overlayVisible = state.leftDrawer.visible
    state.burger.state = (state.leftDrawer.visible) ? BURGER_CLOSE : BURGER_DEFAULT
  },
  [types.TOGGLE_RIGHT_DRAWER](initialState) {
    state.rightDrawer.visible = !state.rightDrawer.visible
    state.overlayVisible = state.rightDrawer.visible
  },
  [types.DISMISS_DRAWERS](initialState) {
    state.leftDrawer.visible = false
    state.rightDrawer.visible = false
    state.overlayVisible = false
    state.burger.state = BURGER_DEFAULT
  },
  [types.DISMISS_LEFT_DRAWER](initialState) {
    state.leftDrawer.visible = false
    state.overlayVisible = false
    state.burger.state = BURGER_DEFAULT
  },
  [types.DISMISS_RIGHT_DRAWER](initialState) {
    state.rightDrawer.visible = false
    state.overlayVisible = false
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
