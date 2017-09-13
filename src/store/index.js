import Vue from 'vue';
import Vuex from 'vuex';
import Moment from 'moment';
import _ from 'lodash';

import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

import layout from './modules/layout';
import navigation from './modules/navigation';
import auth from './modules/auth';
import composer from './modules/composer';

import course from './modules/course';
import conversation from './modules/conversation';
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
    video,
  },
  state: {
    debug: false,
    timetravel: false,
    fauxTime: fauxTime,
    scrollPosition: 0.0,
    pendingScrollPosition: 0,
    offsetScrollPosition: 0.0,
    autoPlaying: false,
    scrollPoints: {},
    currentSection: undefined,
  },
  getters,
  mutations,
});
