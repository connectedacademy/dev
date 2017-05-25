import Vue from 'vue';
import * as types from '@/store/mutation-types';
import API from '@/api';

// initial state
const state = {
  visible: false,
  hidden: false,
};

// getters
const getters = {
};

// actions
const actions = {
};

// mutations
const mutations = {
  [types.SHOW_COMPOSER](initialState) {
    state.visible = true;
    state.hidden = false;
  },
  [types.DISMISS_COMPOSER](initialState) {
    state.visible = false;
    state.hidden = false;
  },
  [types.PEEK_COMPOSER](initialState) {
    state.visible = false;
    state.hidden = false;
  },
  [types.HIDE_COMPOSER](initialState) {
    state.visible = false;
    state.hidden = true;
  },
  [types.DISMISS_COMPOSER](initialState) {
    state.visible = false;
    state.hidden = false;
  },
  [types.SEND_MESSAGE_SUCCESS](initialState, {
    response,
    postData,
  }) {
  },
  [types.SEND_MESSAGE_FAILURE](initialState, {
    response,
  }) {
    alert('Message failed to send');
    // error in response
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
