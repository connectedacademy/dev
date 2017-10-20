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
    url = (request.theClass) ? url + `/${theClass}` : url;
    url = (request.userId) ? url + `/${userId}` : url;
    Vue.http.get(url).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getSubmissions(theClass, cb, errorCb) {
    const url = (theClass) ? `${config.WATERCOOLER_API}/profile/content/${theClass}` : `${config.WATERCOOLER_API}/profile/content`;
    Vue.http.get(url).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getStudents(theClass, cb, errorCb) {
    const url = (theClass) ? `${config.WATERCOOLER_API}/profile/users/${theClass}` : `${config.WATERCOOLER_API}/profile/users`;
    Vue.http.get(url).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
};
