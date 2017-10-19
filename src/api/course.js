import Vue from 'vue';
import * as config from './config';

export default {
  getSchedule(cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/course/schedule`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getSpecPreload(classSlug, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/course/specpreload/${classSlug}/2`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getSpec(classSlug, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/course/spec/${classSlug}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getHubs(passedCourse, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/course/hubs`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getLikeCount(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/messages/likes/${request.class}/${request.content}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
};
