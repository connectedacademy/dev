import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

import layout from './modules/layout';
import navigation from './modules/navigation';
import auth from './modules/auth';

import course from './modules/course';
import message from './modules/message';

Vue.use(Vuex);

export default new Vuex.Store({
  actions,
  modules: {
    layout,
    navigation,
    auth,

    course,
    message,
  },
  state: {
    debug: false,
    scrollPosition: 0,
  },
  getters,
  mutations,
});
