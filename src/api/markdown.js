import Vue from 'vue';
import * as config from './config';

export default {
  fetchMarkdown(markdownUrl, cb, errorCb) {
    Vue.http.get(`${markdownUrl}`, { credentials: false, responseType: 'text' }).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
};
