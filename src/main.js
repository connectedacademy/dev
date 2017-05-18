// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import VueResource from 'vue-resource';
import Vuex from 'vuex';
import VueConfig from 'vue-config';
import VueI18n from 'vue-i18n';
import vueLogger from 'vue-logger';
import VueCookie from 'vue-cookie';

import VueScroll from 'vue-scroll';
import VueAutosize from 'vue-autosize';

import { sync } from 'vuex-router-sync';

import VueYouTubeEmbed from 'vue-youtube-embed';

import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';

import App from './App';
import Lang from './Lang';

import store from './store';
import router from './router';

sync(store, router);

Vue.component('icon', Icon);

require('animate.css');

Vue.use(VueResource);
Vue.use(Vuex);
Vue.use(VueConfig, Vue.config);
Vue.use(vueLogger, { prefix: new Date(), dev: true });
Vue.use(VueCookie);
Vue.use(VueYouTubeEmbed);

Vue.use(VueScroll);
Vue.use(VueAutosize);

// General config
Vue.config.productionTip = false;

// Http config
Vue.http.options = { credentials: true, responseType: 'json' };
Vue.http.interceptors.push((request, next) => {
  next((response) => {
    if (response.status === 403) {
      // eslint-disable-next-line
      console.log('Session invalid');
      // store.dispatch('logout');
    }
  });
});

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
    Icon,
    Lang,
    VueCookie,
  },
});
