/* eslint-disable */
import Vue from 'vue';
import * as config from './config';

import axios from 'axios';

var CancelToken = axios.CancelToken;
var cancel;

// Include and set up Sails client
import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';
const io = sailsIOClient(socketIOClient);
// io.sails.url = 'http://localhost:4000'; // TODO: Enabled for local server
io.sails.url = 'https://api.connectedacademy.io'; // TODO: Enabled for live server
import vueSails from 'vue-sails';


// Enable the plugin globally
Vue.use(vueSails, io);

export default {
  getMessagesSummary(request, cb, errorCb) {

    io.socket.get(`/v1/messages/summary/${request.theClass}/${request.theContent}/${request.startSegment}/${request.endSegment}?whitelist=true`, function (resData, jwres){
      cb(resData);
    });

    // Vue.http.get(`${config.WATERCOOLER_API}/messages/summary/${request.theClass}/${request.theContent}/${request.startSegment}/${request.endSegment}?whitelist=true`).then((response) => {
    //   cb(response.body);
    // }, (response) => {
    //   errorCb(response);
    // });

  },
  cancelBatchRequests() {
    cancel();
  },
  getMessagesSummaryBatch(request, cb, errorCb) {

    // io.socket.get(`/v1/messages/summarybatch/${request.theClass}/${request.theContent}/${request.startSegment}/${request.endSegment}/5?whitelist=true`, function (resData, jwres){
    //   cb(resData);
    // });


    // Vue.http.get(`${config.WATERCOOLER_API}/messages/summarybatch/${request.theClass}/${request.theContent}/${request.startSegment}/${request.endSegment}/5?whitelist=true`).then((response) => {
    //   cb(response.body);
    // }, (response) => {
    //   errorCb(response);
    // });

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
  getMedia(slug, url, cb, errorCb) {
    Vue.http.get(url, { credentials: false, responseType: 'json' }).then((response) => {
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
