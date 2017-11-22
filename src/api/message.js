import Vue from 'vue';
import * as config from '@/api/config';
import store from '@/store';

export default {
  cancelBatchRequests() {
    cancel();
  },
  getSegmentSummary(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/messages/summarybatch/${request.theClass}/${request.theContent}/${request.startSegment}/${request.endSegment}/5?whitelist=true`).then((response) => {
      cb(response.data);
    }, (response) => {
      errorCb(response);
    });
  },
  getSegmentSummarySocket(request, cb, errorCb) {
    Vue.io.socket.get(`/v1/messages/subscribe/${request.theClass}/${request.theContent}/${request.startSegment}/${request.endSegment}?whitelist=true`, function (resData, jwres) {
      cb(resData);
      store.commit('SET_SUBSCRIBED_TO', { start: request.startSegment, end: request.endSegment })
      Vue.$log.info('SOCKET RESPONSE - subscribe');
      Vue.$log.info(resData);
    });
  },
  getContentMessages(request, cb, errorCb) {
    Vue.io.socket.get(`/v1/messages/content/${request.theClass}/${request.theContent}?whitelist=true&limit=100`, function (resData, jwres) {
      cb(resData);
    });
  },
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
  getMedia(slug, path, cb, errorCb) {
    Vue.http.get(path, { credentials: false, responseType: 'json' }).then((response) => {
      cb({slug: slug, response: response.body});
    }, (response) => {
      errorCb({slug: slug, response: response});
    });
  },
  sendMessage(postData, cb, errorCb) {
    Vue.http.options = { credentials: true, responseType: 'json' };
    Vue.http.post(`${config.WATERCOOLER_API}/messages/create`, postData).then((response) => {
      cb(response, postData);
    }, (response) => {
      errorCb(response);
    });
  },
};
