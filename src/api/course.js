import Vue from 'vue';
import * as config from './config';

export default {
  getSchedule(fauxTime, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/course/schedule?time=${fauxTime}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getSpec(fauxTime, classSlug, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/course/spec/${classSlug}?time=${fauxTime}`).then((response) => {
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
