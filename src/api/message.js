/* eslint-disable */
import Vue from 'vue';
import * as config from './config';

export default {
  getMessages(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/messages/list/${request.theClass}/${request.theContent}/${request.startSegment}/${request.endSegment}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getSubtitles(slug, url, cb, errorCb) {
    Vue.http.get(url, { credentials: false, responseType: 'json' }).then((response) => {
      cb({slug: slug, response: response.body});
    }, (response) => {
      errorCb({slug: slug, response: response});
    });
  },
};
