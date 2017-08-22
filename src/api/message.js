/* eslint-disable */
import Vue from 'vue';
import * as config from './config';
import * as types from '@/store/mutation-types';
import store from '@/store';

import axios from 'axios';

let CancelToken = axios.CancelToken;
let cancel;

export default {
  subscribeToSocket() {

    console.log('Subscribing to socket');

    Vue.io.socket.on('user', function(obj) {
      console.log('SOCKET - user');
      console.log(obj);
    });

    Vue.io.socket.on('message', function(obj) {
      console.log('SOCKET - message');
      console.log(obj);
    });

    Vue.io.socket.get(`/v1/auth/me`, function (resData, jwres) {
      console.log('SOCKET RESPONSE - me');
      console.log(resData);
    });
  },
  cancelBatchRequests() {
    cancel();
  },
  getSegmentSummary(request, cb, errorCb) {
    axios.get(`${config.WATERCOOLER_API}/messages/summarybatch/${request.theClass}/${request.theContent}/${request.startSegment}/${request.endSegment}/5?whitelist=true`, {
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c;
      })
    }).then(function (response) {
      Vue.$log.info(response);
      cb(response.data);
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        Vue.$log.info('Request canceled', thrown.message);
      } else {
        // handle error
        Vue.$log.info('There was an error fetching request');
      }
    });
  },
  getSegmentSummarySocket(request, cb, errorCb) {
    
    store.commit(types.SET_SUBSCRIBED_TO, `${request.startSegment} - ${request.endSegment}`)

    Vue.io.socket.get(`/v1/messages/subscribe/${request.theClass}/${request.theContent}/${request.startSegment}/${request.endSegment}?whitelist=true`, function (resData, jwres) {
      cb(resData);
      console.log('SOCKET RESPONSE - subscribe');
      console.log(resData);
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
