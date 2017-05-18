/* eslint-disable */
import Vue from 'vue';
import * as config from './config';

// Include and set up Sails client
import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';
const io = sailsIOClient(socketIOClient);
io.sails.url = 'http://localhost:4000';
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
  sendMessage(postData, cb, errorCb) {
    Vue.http.options = { credentials: true, responseType: 'json' };
    Vue.http.post(`${config.WATERCOOLER_API}/messages/create`, postData).then((response) => {
      cb({slug: response.scope.content, response: response.body});
    }, (response) => {
      errorCb({slug: response.scope.content, response: response.data});
    });
  },
};
