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
import VueAutosize from 'vue-autosize';
// import Raven from 'raven-js';
// import RavenVue from 'raven-js/plugins/vue';


import { sync } from 'vuex-router-sync';

import Icon from 'vue-awesome/components/Icon';

import App from '@/App';
import Lang from '@/Lang';
import Sockets from '@/Sockets';

import store from '@/store';
import router from '@/router';

sync(store, router);

Vue.component('icon', Icon);


Vue.use(VueResource);
Vue.use(Vuex);

Vue.use(VueConfig, Vue.config);

const options = {
  logLevel: 'info',
  // optional : defaults to false if not specified 
  stringifyArguments: false,
  // optional : defaults to false if not specified 
  showLogLevel: false,
  dev: true
}

Vue.use(VueLogger, options)
Vue.use(VueCookie);
Vue.use(VueAutosize);

Vue.use(VueAnalytics, {
  id: 'UA-44963053-16',
  router,
  // autoTracking: {
  //   exception: true,
  // },
});

// TODO: Enabled for production
// Raven.config('https://cd5136ba6a3b46a79ade2112cb23d036@sentry.io/176250').addPlugin(RavenVue, Vue).install();


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

store.dispatch('getCourse');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {
    App,
    Lang,
    Sockets,
  },
});
