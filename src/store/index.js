import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

import layout from './modules/layout';
import navigation from './modules/navigation';
import auth from './modules/auth';

import course from './modules/course';

Vue.use(Vuex);

export default new Vuex.Store({
  actions,
  modules: {
    layout,
    navigation,
    auth,

    course,
  },
  state: {
    debug: false,
  },
  getters,
  mutations,
});
