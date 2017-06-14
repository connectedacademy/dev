/* eslint-disable */
import Vue from 'vue';
import _ from 'lodash';
import * as types from '@/store/mutation-types';
import API from '@/api';
import store from '@/store';;

// initial state
const state = {
  playing: false,
  position: 0.0,
  duration: undefined,
  ready: false,
};

// getters
const getters = {
  videoPlaying() {
    return state.playing;
  },
  videoPosition() {
    return state.position;
  },
  videoDuration() {
    return state.duration;
  },
  videoReady() {
    return state.ready;
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
  [types.VIDEO_READY](initialState) {
    state.ready = true;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
