import * as types from '../mutation-types';
import API from '../../api';

// initial state
const state = {
  messages: {},
};

// getters
const getters = {
  messages() {
    return state.messages;
  },
};

// actions
const actions = {
  getMessages({
    commit,
  }) {
    API.message.getMessages(
      response => commit(types.GET_MESSAGES_SUCCESS, {
        response,
      }),
      response => commit(types.GET_MESSAGES_FAILURE, {
        response,
      }),
    );
  },
};

// mutations
const mutations = {
  [types.GET_MESSAGES_SUCCESS](initialState, {
    response,
  }) {
    state.messages = response.data;
  },
  [types.GET_MESSAGES_FAILURE](initialState, {
    response,
  }) {
    state.messages = {};
    // error in response
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
