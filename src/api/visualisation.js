import Vue from 'vue';
import * as config from '@/api/config';

export default {
  getVisualisation(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/messages/visualisation/${request.class}/${request.content}/5/${request.duration}?whitelist=true`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
};
