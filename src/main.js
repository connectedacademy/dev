// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import VueResource from 'vue-resource';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import vueLogger from 'vue-logger';

import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';

import App from './App';
import Lang from './Lang';

import store from './store';
import router from './router';

Vue.component('icon', Icon);

require('animate.css');

Vue.use(VueResource);
Vue.use(Vuex);
Vue.use(vueLogger, { prefix: new Date(), dev: true });

// General config
Vue.config.productionTip = false;

// I18n config
Vue.config.lang = 'en';
Vue.config.fallbackLang = 'en';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {
    App,
    Lang,
  },
  data() {
    return {
      test: 'true',
    };
  },
});
