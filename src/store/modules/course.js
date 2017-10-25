import Vue from 'vue';
import * as types from '@/store/mutation-types';
import API from '@/api';
import store from '@/store';
import Moment from 'moment-mini';
import includes from 'lodash/includes';
import filter from 'lodash/filter';

// initial state
const state = {
  current_class: undefined,
  current_lang: 'en',
  course: {},
  hubs: {},
};

// getters
const getters = {
  course() {
    return state.course;
  },
  hubs() {
    return state.hubs;
  },
  currentClass() {
    return state.current_class;
  },
  courseContent() {
    if (state.current_class === undefined) { return undefined; }
    return filter(state.current_class.content, item => {
      // Exclude titles from course content
      return !includes(['title'], item.content_type);
    });
  },
};

// actions
const actions = {
  getCourse({
    commit,
  }) {
    API.course.getSchedule(
      response => commit(types.GET_SCHEDULE_SUCCESS, {
        response,
      }),
      response => commit(types.GET_SCHEDULE_FAILURE, {
        response,
      }),
    );
  },
  getSpecPreload({
    commit,
  }, classSlug) {
    state.current_class = {
      slug: classSlug,
      loading: true,
    };
    API.course.getSpecPreload(
      classSlug,
      response => commit(types.GET_SPEC_SUCCESS, {
        response,
      }),
      response => commit(types.GET_SPEC_FAILURE, {
        response,
      }),
    );
  },
  getSpec({
    commit,
  }, classSlug) {
    state.current_class = {
      slug: classSlug,
      loading: true,
    };
    API.course.getSpec(
      classSlug,
      response => commit(types.GET_SPEC_SUCCESS, {
        response,
      }),
      response => commit(types.GET_SPEC_FAILURE, {
        response,
      }),
    );
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
    );
  },
};

// mutations
const mutations = {
  [types.GET_SCHEDULE_SUCCESS](initialState, {
    response,
  }) {
    if (store.state.timetravel) {
      if (response.classes && response.classes.length && response.classes[0].release_at) {
        // Get start of first class
        const classStart = response.classes[0].release_at;
      }
    }
    state.course = response;
  },
  [types.GET_SCHEDULE_FAILURE](initialState, {
    response,
  }) {
    state.course = {};
    // error in response
  },
  [types.GET_SPEC_SUCCESS](initialState, {
    response,
  }) {
    // Only update spec if not exists
    state.current_class = response.spec;

    // Add user if exists
    if (store.state.auth.user) {
      store.state.auth.isAuthenticated = true;
      store.state.auth.user.registration = {};
    }
  },
  [types.GET_SPEC_FAILURE](initialState, {
    response,
  }) {
    state.current_class = undefined;
    // error in response
  },
  [types.GET_HUBS_SUCCESS](initialState, {
    response,
  }) {
    state.hubs = response;
  },
  [types.GET_HUBS_FAILURE](initialState, {
    response,
  }) {
    state.hubs = {};
    // error in response
  },
  [types.SET_CURRENT_CLASS](initialState, currentClass) {
    state.current_class = currentClass;
  },
  [types.SET_COURSE_LANG](initialState, currentLang) {
    state.current_lang = currentLang;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
