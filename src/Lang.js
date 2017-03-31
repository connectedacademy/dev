import Vue from 'vue';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';

import langEn from './lang/en';

Vue.use(VueI18n);

Vue.locale('en', langEn);
