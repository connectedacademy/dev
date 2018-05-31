import Vue from 'vue';
import * as config from '@/api/config';
import store from '@/store';

export default {
  cancelBatchRequests() {
    cancel();
  },
  getSegmentSummary(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/messages/${request.theClass}/${request.startSegment}/${request.endSegment}/true`).then((response) => {
      cb(response.data);
    }, (response) => {
      errorCb(response);
    });
  },
  getMessages(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/messages/${request.theClass}/${request.startSegment}/${request.endSegment}`).then((response) => {
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
  likeMessage(postData, cb, errorCb) {
    Vue.http.options = { credentials: true, responseType: 'json' };
    Vue.http.post(`${config.WATERCOOLER_API}/message/like`, postData).then((response) => {
      cb(response, postData);
    }, (response) => {
      errorCb(response);
    });
  },
};
