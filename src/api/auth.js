import Vue from 'vue';
import * as config from '@/api/config';

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
  register(postData, cb, errorCb) {
    Vue.http.options = { credentials: true, responseType: 'json' };
    Vue.http.post(`${config.WATERCOOLER_API}/auth/register`, postData).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  fetchQuestions(cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/auth/registrationquestions`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
};
