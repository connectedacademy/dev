import Vue from 'vue';
import * as config from './config';

export default {
  getSpec(course, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/course/spec`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getHubs(course, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/course/hubs`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
};
