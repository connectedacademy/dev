import Vue from 'vue';
import * as config from './config';
import Moment from 'moment';

export default {
  getSchedule(passedCourse, cb, errorCb) {

    let currentTime = Moment();
    currentTime = currentTime.subtract(40, 'days');
    currentTime = currentTime.format();
    currentTime = currentTime.replace('+', encodeURIComponent('+'));

    Vue.http.get(`${config.WATERCOOLER_API}/course/schedule?time=${currentTime}`).then((response) => {
      console.log('response');
      console.log(response);
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getSpec(classSlug, cb, errorCb) {

    let currentTime = Moment();
    currentTime = currentTime.subtract(40, 'days');
    currentTime = currentTime.format();
    currentTime = currentTime.replace('+', encodeURIComponent('+'));

    Vue.http.get(`${config.WATERCOOLER_API}/course/spec/${classSlug}?time=${currentTime}`).then((response) => {
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
