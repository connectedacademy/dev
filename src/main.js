// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import VueResource from 'vue-resource';
import Vuex from 'vuex';
import VueConfig from 'vue-config';
import VueI18n from 'vue-i18n';
import VueLogger from 'vuejs-logger'
import VueCookie from 'vue-cookie';
import VueAnalytics from 'vue-analytics'
// import VueAutosize from 'vue-autosize';
// import Raven from 'raven-js';
// import RavenVue from 'raven-js/plugins/vue';


import { sync } from 'vuex-router-sync';

import Icon from 'vue-awesome/components/Icon';

import App from '@/App';
import Lang from '@/Lang';

import store from '@/store';;
import router from '@/router';

sync(store, router);

import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';
import vueSails from 'vue-sails';
// Setup socket connection
const io = sailsIOClient(socketIOClient);
io.sails.url = 'https://api.connectedacademy.io';
Vue.io = io;
Vue.use(vueSails, io);

Vue.component('icon', Icon);
require('animate.css');

Vue.use(VueResource);
Vue.use(Vuex);

Vue.use(VueConfig, Vue.config);

const options = {
  logLevel: 'info',
  // optional : defaults to false if not specified 
  stringifyArguments: false,
  // optional : defaults to false if not specified 
  showLogLevel: false,
  dev: false
}

Vue.use(VueLogger, options)

Vue.use(VueCookie);

Vue.use(VueAnalytics, {
  id: 'UA-44963053-16',
  router,
  // autoTracking: {
  //   exception: true,
  // },
});

// TODO: Enabled for production
// Raven.config('https://cd5136ba6a3b46a79ade2112cb23d036@sentry.io/176250').addPlugin(RavenVue, Vue).install();

// Vue.use(VueAutosize);

// General config
Vue.config.productionTip = false;

// Http config
Vue.http.options = { credentials: true, responseType: 'json' };
Vue.http.interceptors.push((request, next) => {
  next((response) => {
    if (response.status === 403) {
      this.$log.info('Session invalid');
      store.dispatch('logout');
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
