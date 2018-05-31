import Vue from 'vue'
import * as types from '@/store/mutation-types'
import API from '@/api'
import _filter from 'lodash/filter'
import _find from 'lodash/find'

// initial state
const state = {
  current_class: undefined,
  current_lang: 'en',
  course: {
    loaded: false
  },
  hubs: {},
}

// getters
const getters = {
  course() {
    return state.course
  },
  hubs() {
    return state.hubs
  },
  currentClass() {
    return state.current_class
  },
  classContent() {
    if (!state.current_class) return []
    return state.current_class.content
  },
  liveClass() {
    if (!state.current_class) return {}
    return _find(state.current_class.content, { type: 'liveclass' })
  }
}

// actions
const actions = {
  getCourse({
    commit,
  }) {
    API.course.getCourse(
      response => commit(types.GET_COURSE_SUCCESS, {
        response,
      }),
      response => commit(types.GET_COURSE_FAILURE, {
        response,
      }),
    )
  },
  getClass({
    commit,
  }, classSlug) {
    if (typeof classSlug === 'undefined') return
    state.current_class = {
      slug: classSlug,
      title: classSlug.charAt(0).toUpperCase() + classSlug.slice(1),
      loading: true,
    }
    API.course.getClass(
      classSlug,
      response => commit(types.GET_CLASS_SUCCESS, {
        response,
      }),
      response => commit(types.GET_CLASS_FAILURE, {
        response,
      }),
    )
  },
  getHubs({
    commit,
  }) {
    API.course.getHubs(
      API.course,
      response => commit(types.GET_HUBS_SUCCESS, {
        response,
      }),
      response => commit(types.GET_HUBS_FAILURE, {
        response,
      }),
    )
  },
}

// mutations
const mutations = {
  [types.GET_COURSE_SUCCESS](initialState, {
    response,
  }) {
    state.course = response
    state.course.loaded = true
  },
  [types.GET_COURSE_FAILURE](initialState, {
    response,
  }) {
    state.course = {
      loaded: false
    }
    // error in response
  },
  [types.GET_CLASS_SUCCESS](initialState, {
    response,
  }) {
    // Only update spec if not exists
    state.current_class = response
  },
  [types.GET_CLASS_FAILURE](initialState, {
    response,
  }) {
    state.current_class = undefined
    // error in response
  },
  [types.GET_HUBS_SUCCESS](initialState, {
    response,
  }) {
    state.hubs = response
  },
  [types.GET_HUBS_FAILURE](initialState, {
    response,
  }) {
    state.hubs = {}
    // error in response
  },
  [types.SET_CURRENT_CLASS](initialState, currentClass) {
    state.current_class = currentClass
  },
  [types.SET_COURSE_LANG](initialState, currentLang) {
    state.current_lang = currentLang
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
