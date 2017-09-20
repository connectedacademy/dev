/* eslint-disable */
import Vue from 'vue';
import _ from 'lodash/core';
import * as types from '@/store/mutation-types';
import API from '@/api';
import store from '@/store';

// initial state
const state = {
  visible: false,
  currentMedia: undefined,
};

// getters
const getters = {
  currentLightboxMedia() {
    return state.currentMedia;
  },
  lightboxVisible() {
    return state.visible;
  },
};

// actions
const actions = {
};

// mutations
const mutations = {
  [types.SET_LIGHTBOX_MEDIA](initialState, media) {
    state.currentMedia = media;
    state.visible = (media !== undefined);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
