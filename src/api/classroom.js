import Vue from 'vue';
import * as config from './config';

export default {
  getTeacherCode(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/classroom/mycode/${request.theClass}/${request.slug}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  registerAttendance(postData, cb, errorCb) {
    Vue.http.options = { credentials: true, responseType: 'json' };
    Vue.http.post(`${config.WATERCOOLER_API}/classroom/inclass`, postData).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getClassroomUsers(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/classroom/users/${request.theClass}/${request.slug}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getClassroomStatus(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/classroom/getclass/${request.theClass}/${request.slug}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
};
