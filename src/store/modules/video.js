/* eslint-disable */
import Vue from 'vue';
import _ from 'lodash';
import * as types from '../mutation-types';
import API from '../../api';
import globalState from '../index';

// initial state
const state = {
  playing: false,
  position: 0.0,
  duration: undefined,
};

// getters
const getters = {
  playing() {
    return state.playing;
  },
  position() {
    return state.position;
  },
  duration() {
    return state.duration;
  },
};

// actions
const actions = {
};

// mutations
const mutations = {
  [types.PAUSE_VIDEO](initialState) {
    state.playing = false;
  },
  [types.PLAY_VIDEO](initialState) {
    state.playing = true;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
