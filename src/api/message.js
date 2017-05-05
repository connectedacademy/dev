/* eslint-disable */
import Vue from 'vue';
import * as config from './config';

export default {
  getMessages(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/messages/list/${request.theClass}/${request.theContent}/${request.startSegment}/${request.endSegment}?whitelist=true`).then((response) => {
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
  sendMessage(postData, cb, errorCb) {
    Vue.http.options = { credentials: true, responseType: 'json' };
    Vue.http.post(`${config.WATERCOOLER_API}/messages/create`, postData).then((response) => {
      cb({slug: response.scope.content, response: response.body});
    }, (response) => {
      errorCb({slug: response.scope.content, response: response.data});
    });
  },
};
