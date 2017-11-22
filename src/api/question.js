import Vue from 'vue';
import * as config from '@/api/config';

export default {
  getPostCourseQuestions(cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/analytics/postquestions`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  getQuestion(request, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/analytics/question/${request.theClass}/${request.slug}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  postAnswer(postData, cb, errorCb) {
    Vue.http.options = { credentials: true, responseType: 'json' };
    Vue.http.post(`${config.WATERCOOLER_API}/analytics/answer/response`, postData).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
};
