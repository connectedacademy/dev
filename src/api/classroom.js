import Vue from 'vue';
import * as config from '@/api/config';

export default {
  getTeacherCode(theClass, cb, errorCb) {
    Vue.http.get(`${config.API}/classroom/mycode/${theClass}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  registerAttendance(postData, cb, errorCb) {
    Vue.http.options = { credentials: true, responseType: 'json' };
    Vue.http.post(`${config.API}/classroom/inclass`, postData).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getClassroomUsers(request, cb, errorCb) {
    Vue.http.get(`${config.API}/classroom/users/${request.theClass}/${request.slug}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getClassroomStatus(request, cb, errorCb) {
    Vue.http.get(`${config.API}/classroom/getclass/${request.theClass}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
};
