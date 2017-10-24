import Vue from 'vue';
import Vuex from 'vuex';
import Moment from 'moment-mini';

import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

import navigation from './modules/navigation';
import auth from './modules/auth';
import composer from './modules/composer';

import course from './modules/course';
import conversation from './modules/conversation';
import lightbox from './modules/lightbox';
import video from './modules/video';
import profile from './modules/profile';

Vue.use(Vuex);

export default new Vuex.Store({
  actions,
  modules: {
    navigation,
    auth,
    composer,

    course,
    conversation,
    lightbox,
    video,
    profile,
  },
  state: {
    debug: false,
    savedScrollPosition: 0.0,
    scrollPoints: {},
    currentSection: undefined,
  },
  getters,
  mutations,
});
