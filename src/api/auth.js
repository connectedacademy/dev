import Vue from 'vue';
import * as config from './config';

export default {
  checkAuth(cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/auth/me`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  logout(cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/auth/logout`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
};
