import Vue from 'vue';
import * as config from './config';

export default {
  getSubmissions(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/admin/content/${request.theClass}/${request.slug}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getCourseUsers(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/admin/users`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
};
