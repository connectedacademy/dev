import Vue from 'vue'
import * as types from '@/store/mutation-types'
import API from '@/api'
import * as config from '@/api/config'

// initial state
const state = {
  visible: false,
  user: undefined
}

// getters
const getters = {
  user: (initialState) => initialState.user,
  isRegistered: (initialState) => {
    return typeof initialState.user !== 'undefined'
  }
}

// actions
const actions = {
  checkAuth({ commit }) {
    Vue.$log.info('Checking auth...')
    API.auth.checkAuth(
      response => commit(types.CHECK_AUTH_SUCCESS, { response }),
      response => commit(types.CHECK_AUTH_FAILURE, { response })
    )
  },
  logout({ commit }) {
    Vue.$log.info('Logging out...')
    API.auth.logout(
      response => commit(types.LOGOUT_SUCCESS, { response }),
      response => commit(types.LOGOUT_FAILURE, { response })
    )
  },
}

// mutations
const mutations = {
  [types.SHOW_AUTH](initialState) {
    state.visible = true
  },
  [types.DISMISS_AUTH](initialState) {
    state.visible = false
  },
  [types.CHECK_AUTH_SUCCESS](initialState, {
    response,
  }) {
    Vue.$log.info('Auth success')
    Vue.$log.info(response)
    // Save user in session
    state.user = response.user
  },
  [types.CHECK_AUTH_FAILURE](initialState, {
    response,
  }) {
    Vue.$log.info('Auth failure')
    // error in response
  },
  [types.LOGOUT_SUCCESS](initialState, {
    response,
  }) {
    state.visible = false
    state.user = undefined
  },
  [types.LOGOUT_FAILURE](initialState, {
    response,
  }) {
    // error in response
  },
  attemptAuth({ commit }) {
    document.location = config.AUTH_URL
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
