import Vue from 'vue'
import * as types from '@/store/mutation-types'
import API from '@/api'
import _filter from 'lodash/filter'
import _find from 'lodash/find'

// initial state
const state = {
  current_class: undefined,
  current_lang: 'en',
  course: {},
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
  primaryContent() {
    if (!state.current_class) return []
    return _filter(state.current_class.content, (content) => {
      const types = ['intro', 'content', 'fourcorners', 'nextclass', 'homework']
      return types.indexOf(content.content_type) !== -1
    })
  },
  liveclassContent() {
    if (!state.current_class) return undefined
    return _find(state.current_class.content, { content_type: 'class' })
  }
}

// actions
const actions = {
  getSchedule({
    commit,
  }) {
    API.course.getSchedule(
      response => commit(types.GET_SCHEDULE_SUCCESS, {
        response,
      }),
      response => commit(types.GET_SCHEDULE_FAILURE, {
        response,
      }),
    )
  },
  getSpec({
    commit,
  }, classSlug) {
    if (typeof classSlug === 'undefined') return
    state.current_class = {
      slug: classSlug,
      title: classSlug.charAt(0).toUpperCase() + classSlug.slice(1),
      loading: true,
    }
    API.course.getSpec(
      classSlug,
      response => commit(types.GET_SPEC_SUCCESS, {
        response,
      }),
      response => commit(types.GET_SPEC_FAILURE, {
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
  [types.GET_SCHEDULE_SUCCESS](initialState, {
    response,
  }) {
    state.course = response
  },
  [types.GET_SCHEDULE_FAILURE](initialState, {
    response,
  }) {
    state.course = {}
    // error in response
  },
  [types.GET_SPEC_SUCCESS](initialState, {
    response,
  }) {
    // Only update spec if not exists
    state.current_class = response.spec
  },
  [types.GET_SPEC_FAILURE](initialState, {
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
