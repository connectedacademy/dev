/* eslint-disable */
import Vue from 'vue';
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
  }, request) {
    API.message.getMessages(
      request,
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
    for (const segment in response.data) {
      state.messages[segment] = response.data[segment];
    }
  },
  [types.GET_MESSAGES_FAILURE](initialState, {
    response,
  }) {
    state.messages = [];
    // error in response
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
