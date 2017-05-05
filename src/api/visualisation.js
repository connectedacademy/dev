import Vue from 'vue';
import * as config from './config';

export default {
  getVisualisation(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/messages/visualisation/${request.theClass}/${request.theContent}?whitelist=true`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
};
