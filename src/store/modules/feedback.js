import * as types from '../mutation-types';
import API from '@/api';

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
  //   API.course.getSchedule(
  //     API.course,
  //     response => commit(types.GET_SCHEDULE_SUCCESS, {
  //       response,
  //     }),
  //     response => commit(types.GET_SCHEDULE_FAILURE, {
  //       response,
  //     }),
  //   );
  // },
};

// mutations
const mutations = {
  // [types.GET_SCHEDULE_SUCCESS](initialState, {
  //   response,
  // }) {
  //   state.course = response;
  // },
  // [types.GET_SCHEDULE_FAILURE](initialState, {
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
