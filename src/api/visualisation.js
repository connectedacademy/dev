import Vue from 'vue';
import * as config from '@/api/config';

export default {
  getVisualisation(request, cb, errorCb) {
    // lin, log, raw
    // Vue.http.get(`${config.WATERCOOLER_API}/messages/visualisation/${request.class}/${request.content}/5/${request.duration}?whitelist=true&clearcache=false&scale=log`).then((response) => {
    // // Vue.http.get(`${config.WATERCOOLER_API}/messages/visualisation/${request.class}/${request.content}/5/${request.duration}?whitelist=true`).then((response) => {
    //   cb(response.body);
    // }, (response) => {
    //   errorCb(response);
    // });
    // Get user socket (for submissions and feedback messages)
    Vue.io.socket.get(`${config.WATERCOOLER_API}/messages/visualisation/${request.class}/${request.content}/5/${request.duration}?whitelist=true&clearcache=false&scale=log`, function (resData, jwres) {
      // Vue.$log.debug('SOCKET RESPONSE - me')
      cb(resData);
      // alert('SOCKET RESPONSE - me')
      // Vue.$log.debug(resData)
    })
  },
};
