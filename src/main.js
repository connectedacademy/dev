// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import Vuex from 'vuex'
import VueAnalytics from 'vue-analytics'
import VueAutosize from 'vue-autosize'
import VueConfig from 'vue-config'
import VueCookie from 'vue-cookie'
import VueI18n from 'vue-i18n'
import VueLogger from 'vuejs-logger'
import { VueMasonryPlugin } from 'vue-masonry'
import VueResource from 'vue-resource'

// import Raven from 'raven-js'
// import RavenVue from 'raven-js/plugins/vue'

import { sync } from 'vuex-router-sync'


import app_config from '@/config'
import * as api_config from '@/api/config'

import logging from '@/logging'
import store from '@/store'
import router from '@/router'

import App from '@/App'
import Lang from '@/Lang'
import Sockets from '@/Sockets'

import { EventBus } from '@/event-bus.js'

import Icon from 'vue-awesome/components/Icon'
import OnboardingPrompt from '@/components/shared/OnboardingPrompt'

// Global components
Vue.component('icon', Icon)
Vue.component('onboarding-prompt', OnboardingPrompt)

Vue.prototype.$app = app_config
Vue.prototype.$logging = logging

sync(store, router)

Vue.use(VueResource)
Vue.use(Vuex)

Vue.use(VueConfig, Vue.config)
Vue.use(VueMasonryPlugin)

const options = {
  logLevel: 'info', // error
  stringifyArguments: false,
  showLogLevel: false,
  dev: true
}

Vue.use(VueLogger, options)
Vue.use(VueCookie)
Vue.use(VueAutosize)

Vue.use(VueAnalytics, {
  id: app_config.ga_id,
  router,
  autoTracking: {
    exception: true
  }
})

// TODO: Enabled for production
// Raven.config(app_config.sentry).addPlugin(RavenVue, Vue).install()

// General config
Vue.config.productionTip = false

// Http config
Vue.http.options = { credentials: true, responseType: 'json', timeout: 5000 }

Vue.http.interceptors.push((request, next) => {
  if (request.url.startsWith(api_config.WATERCOOLER_API)) {
    // Add elevator version to every request
    request.headers.set('elevator-version', `${app_config.version}`)
  }

  // continue to next interceptor
  next(function (response) {

    // modify response
    if (response.status === 403) {
      // Unauthorized
      alert('Unauthorized')
    }
  })

})

// I18n config
Vue.config.lang = 'en'
Vue.config.fallbackLang = 'en'

store.dispatch('getCourse')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {
    App,
    Lang,
    Sockets
  }
})
