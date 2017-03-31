import Vue from 'vue';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';

import langEn from './lang/en';
import langEs from './lang/es';

Vue.use(VueI18n);

Vue.locale('en', langEn);
Vue.locale('es', langEs);
