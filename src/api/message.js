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
  getSubtitles(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/subtitles/${request.theClass}/${request.filename}`, { credentials: false, responseType: 'json' }).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getMedia(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/media/${request.theClass}/${request.filename}`, { credentials: false, responseType: 'json' }).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
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
