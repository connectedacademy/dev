import Vue from 'vue';
import * as config from './config';

export default {
  getMessages(cb, errorCb) {
    const theClass = 'weekX';
    const theContent = 'classX';
    const startSegment = '1';
    const endSegment = '10';

    Vue.http.get(`${config.WATERCOOLER_API}/messages/list/${theClass}/${theContent}/${startSegment}/${endSegment}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
};
