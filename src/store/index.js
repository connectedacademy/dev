import Vue from 'vue';
import Vuex from 'vuex';
import Moment from 'moment-mini';
import _ from 'lodash/core';

import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

import layout from './modules/layout';
import navigation from './modules/navigation';
import auth from './modules/auth';
import composer from './modules/composer';

import course from './modules/course';
import conversation from './modules/conversation';
import lightbox from './modules/lightbox';
import video from './modules/video';

Vue.use(Vuex);


const fauxTime = Moment().format();

export default new Vuex.Store({
  actions,
  modules: {
    layout,
    navigation,
    auth,
    composer,

    course,
    conversation,
    lightbox,
    video,
  },
  state: {
    debug: false,
    timetravel: false,
    fauxTime: fauxTime,
    scrollPosition: 0.0,
    savedScrollPosition: 0.0,
    pendingScrollPosition: 0,
    offsetScrollPosition: 0.0,
    autoPlaying: false,
    scrollPoints: {},
    currentSection: undefined,
  },
  getters,
  mutations,
});
