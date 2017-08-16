import Vue from 'vue';
import * as config from './config';

export default {
  getQuestionResponses(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/analytics/answers`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
};
