/* eslint-disable */
import Vue from 'vue';
import * as config from '@/api/config';

export default {
  getHomeworks(cb, errorCb) {
    Vue.http.get(`${config.API}/homework`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getHomework(id, cb, errorCb) {
    Vue.http.get(`${config.API}/homework/${id}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  postHomework(postData, cb, errorCb) {
    Vue.http.options = { credentials: true, responseType: 'json' };
    Vue.http.post(`${config.API}/homework`, postData).then((response) => {
      cb(response);
    }, (response) => {
      errorCb(response);
    });
  },
  getHomeworkMessages(id, cb, errorCb) {
    Vue.http.get(`${config.API}/homework/messages/${id}`).then((response) => {
      cb(response);
    }, (response) => {
      errorCb(response);
    });
  },
  postHomeworkMessage(postData, cb, errorCb) {
    Vue.http.options = { credentials: true, responseType: 'json' };
    Vue.http.post(`${config.API}/homework/message`, postData).then((response) => {
      cb(response);
    }, (response) => {
      errorCb(response);
    });
  },
  getDiscussion(request, cb, errorCb) {
    Vue.http.get(`${config.API}/discussion/messages/${request.id}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getFeedbackItems(request, cb, errorCb) {
    Vue.http.get(`${config.API}/discussion/list/${request.class}/${request.content}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getAvailableFeedbackItems(request, cb, errorCb) {
    Vue.http.get(`${config.API}/discussion/available/${request.class}/${request.content}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  postFeedbackMessage(postData, cb, errorCb) {
    Vue.http.options = { credentials: true, responseType: 'json' };
    Vue.http.post(`${config.API}/discussion/create/${postData.id}`, postData).then((response) => {
      cb(response);
    }, (response) => {
      errorCb(response);
    });
  },
  getUserSubmissions(request, cb, errorCb) {
    Vue.http.options = { credentials: true, responseType: 'json' };
    Vue.http.get(`${config.API}/discussion/user/${request.classSlug}/${request.contentSlug}/${request.userId}`).then((response) => {
      cb(response);
    }, (response) => {
      errorCb(response);
    });
  },
  verifySubmission(postData, cb, errorCb) {
    Vue.http.options = { credentials: true, responseType: 'json' };
    Vue.http.post(`${config.API}/discussion/verify/${postData.submission}`, postData).then((response) => {
      cb(response);
    }, (response) => {
      errorCb(response);
    });
  },
  removeSubmission(postData, cb, errorCb) {
    Vue.http.options = { credentials: true, responseType: 'json' };
    Vue.http.post(`${config.API}/discussion/remove`, postData).then((response) => {
      cb(response);
    }, (response) => {
      errorCb(response);
    });
  },
};
