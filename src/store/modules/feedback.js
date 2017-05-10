import * as types from '../mutation-types';
import API from '../../api';

// initial state
const state = {
  // course: {},
};

// getters
const getters = {
  // course() {
  //   return state.course;
  // },
};

// actions
const actions = {
  // getCourse({
  //   commit,
  // }) {
  //   API.course.getSpec(
  //     API.course,
  //     response => commit(types.GET_COURSE_SPEC_SUCCESS, {
  //       response,
  //     }),
  //     response => commit(types.GET_COURSE_SPEC_FAILURE, {
  //       response,
  //     }),
  //   );
  // },
};

// mutations
const mutations = {
  // [types.GET_COURSE_SPEC_SUCCESS](initialState, {
  //   response,
  // }) {
  //   state.course = response;
  // },
  // [types.GET_COURSE_SPEC_FAILURE](initialState, {
  //   response,
  // }) {
  //   state.course = {};
  //   // error in response
  // },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
