/* eslint-disable */
import Vue from 'vue';
import * as config from './config';

import axios from 'axios';

let CancelToken = axios.CancelToken;
let cancel;

export default {
  subscribeToSocket() {

    console.log('Subscribing to socket');

    // Vue.io.socket.on('user', function(obj) {
    //   console.log('SOCKET - user');
    //   console.log(obj);
    // });

    Vue.io.socket.on('message', function(obj) {
      console.log('SOCKET - message');
      console.log(obj);
    });

    Vue.io.socket.get(`/v1/auth/me`, function (resData, jwres){
      console.log('SOCKET RESPONSE');
      console.log(resData);
    });
  },
  getMessagesSummary(request, cb, errorCb) {

    Vue.io.socket.get(`/v1/messages/summary/${request.theClass}/${request.theContent}/${request.startSegment}/${request.endSegment}?whitelist=true`, function (resData, jwres){
      cb(resData);
    });

  },
  cancelBatchRequests() {
    cancel();
  },
  getMessagesSummaryBatch(request, cb, errorCb) {

    axios.get(`${config.WATERCOOLER_API}/messages/summarybatch/${request.theClass}/${request.theContent}/${request.startSegment}/${request.endSegment}/5?whitelist=true`, {
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c;
      })
    }).then(function (response) {
      Vue.log.log(response);
      cb(response.data);
    }).catch(function(thrown) {
      if (axios.isCancel(thrown)) {
        Vue.log.log('Request canceled', thrown.message);
      } else {
        // handle error
        Vue.log.log('There was an error fetching request');
      }
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
