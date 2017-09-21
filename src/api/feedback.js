/* eslint-disable */
import Vue from 'vue';
import * as config from './config';

export default {
  getFeedbackItem(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/discussion/submission/${request.id}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getDiscussion(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/discussion/messages/${request.id}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getFeedbackItems(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/discussion/list/${request.class}/${request.content}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getAvailableFeedbackItems(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/discussion/available/${request.class}/${request.content}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  postFeedbackMessage(postData, cb, errorCb) {
    Vue.http.options = { credentials: true, responseType: 'json' };
    Vue.http.post(`${config.WATERCOOLER_API}/discussion/create/${postData.id}`, postData).then((response) => {
      cb(response);
    }, (response) => {
      errorCb(response);
    });
  },
  getUserSubmissions(request, cb, errorCb) {
    Vue.http.options = { credentials: true, responseType: 'json' };
    Vue.http.get(`${config.WATERCOOLER_API}/discussion/user/${request.classSlug}/${request.contentSlug}/${request.userId}`).then((response) => {
      cb(response);
    }, (response) => {
      errorCb(response);
    });
  },
};
