import Vue from 'vue';
import * as config from './config';

export default {
  getMessages(cb, errorCb) {
    const theClass = 'ABC';
    const startSegment = '123';
    const endSegment = '123';

    Vue.http.get(`${config.WATERCOOLER_API}/messages/list/${theClass}/${startSegment}/${endSegment}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
};
