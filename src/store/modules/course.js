import * as types from '../mutation-types';
import API from '../../api';

// initial state
const state = {
  current_class: undefined,
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
    if (state.current_class === undefined) { return undefined; }
    return state.course.classes[state.current_class];
  },
  coursePreContent() {
    if (state.current_class === undefined) { return undefined; }
    return state.course.classes[state.current_class].content.filter(item => (item.content_type === 'submission'));
  },
  courseClassContent() {
    if (state.current_class === undefined) { return undefined; }
    return state.course.classes[state.current_class].content.filter(item => (item.content_type === 'class'));
  },
  coursePostClassContent() {
    if (state.current_class === undefined) { return undefined; }
    return state.course.classes[state.current_class].content.filter(item => (item.content_type === 'postclass'));
  },
  courseWebinarContent() {
    if (state.current_class === undefined) { return undefined; }
    return state.course.classes[state.current_class].content.filter(item => (item.content_type === 'webinar'));
  },
  coursePostWebinarContent() {
    if (state.current_class === undefined) { return undefined; }
    return state.course.classes[state.current_class].content.filter(item => (item.content_type === 'postwebinar'));
  },
};

/* eslint-disable */
// actions
const actions = {
  getCourse({
    commit,
  }) {
    API.course.getSpec(
      API.course,
      response => commit(types.GET_COURSE_SPEC_SUCCESS, {
        response,
      }),
      response => commit(types.GET_COURSE_SPEC_FAILURE, {
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
  [types.GET_COURSE_SPEC_SUCCESS](initialState, {
    response,
  }) {
    state.course = response;
  },
  [types.GET_COURSE_SPEC_FAILURE](initialState, {
    response,
  }) {
    state.course = {};
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
  [types.SET_CURRENT_CLASS](initialState, selectedClass) {
    state.current_class = selectedClass;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
