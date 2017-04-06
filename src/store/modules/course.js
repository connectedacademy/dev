import course from '../../api/course';
import * as types from '../mutation-types';

// initial state
const state = {
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
  coursePreContent() {
    return state.course.classes[0].content.filter(item => (item.content_type === 'submission'));
  },
  courseClassContent() {
    return state.course.classes[0].content.filter(item => (item.content_type === 'class'));
  },
  coursePostClassContent() {
    return state.course.classes[0].content.filter(item => (item.content_type === 'postclass'));
  },
  courseWebinarContent() {
    return state.course.classes[0].content.filter(item => (item.content_type === 'webinar'));
  },
  coursePostWebinarContent() {
    return state.course.classes[0].content.filter(item => (item.content_type === 'postwebinar'));
  },
};

// actions
const actions = {
  getCourse({
    commit,
  }) {
    course.getSpec(
      course,
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
    course.getHubs(
      course,
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
};

export default {
  state,
  getters,
  actions,
  mutations,
};
