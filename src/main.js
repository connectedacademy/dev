// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import VueResource from 'vue-resource';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import vueLogger from 'vue-logger';

import VueYouTubeEmbed from 'vue-youtube-embed';

import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';

import App from './App';
import Lang from './Lang';

import store from './store';
import router from './router';

Vue.component('icon', Icon);

require('animate.css');

// Attach cookies to API request
// Vue.http.interceptors.push((request, next) => {
//   request.headers.set('Access-Control-Allow-Origin', '*');
//   request.headers.set('Access-Control-Allow-Credentials', true);
//   // request.credentials = true;
//   next();
// });

Vue.use(VueResource);
Vue.use(Vuex);
Vue.use(vueLogger, { prefix: new Date(), dev: true });
Vue.use(VueYouTubeEmbed);

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
