import Vue from 'vue';
import * as config from './config';

export default {
  getClasses(cb, errorCb) {
    const url = `${config.WATERCOOLER_API}/profile/classes`;
    Vue.http.get(url).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getMessages(request, cb, errorCb) {
    let url = `${config.WATERCOOLER_API}/profile/messages`;
    url = (typeof request.userId === 'undefined') ? url : `${config.WATERCOOLER_API}/profile/mymessages`;
    url = (typeof request.theClass === 'undefined') ? url : url + `/${request.theClass}`;
    url = (typeof request.teacher === 'undefined') ? url : url + `?teacher=true`;
    
    Vue.http.get(url).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getSubmissions(request, cb, errorCb) {
    let url = `${config.WATERCOOLER_API}/profile/content`;
    url = (typeof request.userId === 'undefined') ? url : `${config.WATERCOOLER_API}/profile/mycontent`;
    url = (typeof request.theClass === 'undefined') ? url : url + `/${request.theClass}`;
    url = (typeof request.teacher === 'undefined') ? url : url + `?teacher=true`;

    Vue.http.get(url).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getStudents(request, cb, errorCb) {
    let url = `${config.WATERCOOLER_API}/profile/users`;
    if (typeof request.theClass !== 'undefined') {
      url = `${config.WATERCOOLER_API}/profile/users/${request.theClass}?teacher=true`
    }
    Vue.http.get(url).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
};
