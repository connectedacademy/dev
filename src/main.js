// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import VueResource from 'vue-resource';
import VueKeepScrollPosition from 'vue-keep-scroll-position';
import VueScrollBehavior from 'vue-scroll-behavior';
import Vuex from 'vuex';
import VueConfig from 'vue-config';
import VueI18n from 'vue-i18n';
import VueLogger from 'vuejs-logger'
import VueCookie from 'vue-cookie';
import VueAnalytics from 'vue-analytics'
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

import VueScroll from 'vue-scroll';
import VueAutosize from 'vue-autosize';

import VueAwesomeSwiper from 'vue-awesome-swiper'

import { sync } from 'vuex-router-sync';

import VueYouTubeEmbed from 'vue-youtube-embed';

import 'vue-awesome/icons';
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

Icon.register({
  'ca-heart': {
    width: 320,
    height: 320,
    paths: [
      {
        style: 'fill:none; stroke:#333; stroke-linecap:round; stroke-linejoin:round; stroke-width:6px; overflow:visible;',
        d: 'M231.65,8c19.35,0,39.46,9.48,55.18,26C302.82,50.79,312,72.63,312,93.91c0,31-24.93,76-68.41,123.46-17,18.59-35.79,36.2-52.79,49.58-19.5,15.35-28.84,18.89-30.77,19s-11.3-3.61-30.8-19c-17-13.38-35.74-31-52.79-49.57C33,170,8,125,8,93.92,8,49.76,46.82,8,87.86,8A58.65,58.65,0,0,1,122,19c12,8.37,22.34,21.34,30.81,38.46A8,8,0,0,0,160,62h0a8,8,0,0,0,7.18-4.56c8.27-17.1,18.5-30,30.38-38.4a58.23,58.23,0,0,1,34-11H232m-0.36-8c-26.25,0-53,15.3-71.64,53.92C140.9,15.29,114.09,0,87.86,0,43.07,0,0,44.63,0,93.92c0,78.15,135.77,200,160,200s160-121.85,160-200C320,44.62,276.48,0,231.64,0h0Z'
      }
    ]
  }
});

Vue.component('icon', Icon);

require('swiper/dist/css/swiper.css')
require('animate.css');

Vue.use(VueResource);
Vue.use(Vuex);
Vue.use(VueKeepScrollPosition);
Vue.use(VueScrollBehavior, {
  router: router,
  // maxLength: 100,
  // ignore: [], // [/\/boo/, /\/zoo/]
})
Vue.use(VueAwesomeSwiper)

Vue.use(VueConfig, Vue.config);

const options = {
  logLevel: 'info',
  // optional : defaults to false if not specified 
  stringifyArguments: false,
  // optional : defaults to false if not specified 
  showLogLevel: false
}

Vue.use(VueLogger, options)

Vue.use(VueCookie);

Vue.use(VueAnalytics, {
  id: 'UA-44963053-16',
  router,
  autoTracking: {
    exception: true,
  },
});

// TODO: Enabled for production
// Raven.config('https://cd5136ba6a3b46a79ade2112cb23d036@sentry.io/176250').addPlugin(RavenVue, Vue).install();

Vue.use(VueYouTubeEmbed);
Vue.use(VueScroll);
Vue.use(VueAutosize);

// General config
// Vue.config.productionTip = false;

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

Vue.config.devtools = true;
Vue.config.debug = true;
Vue.config.silent = false;

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
