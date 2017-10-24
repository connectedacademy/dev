import Vue from 'vue';
import * as config from '@/api/config';

import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';
import vueSails from 'vue-sails';
const io = sailsIOClient(socketIOClient);

io.sails.url = config.SOCKET_API;
Vue.io = io;
Vue.use(vueSails, io);

// Get user socket (for submissions and feedback messages)
Vue.io.socket.get(`/v1/auth/me`, function (resData, jwres) {
  Vue.$log.info('SOCKET RESPONSE - me');
  Vue.$log.info(resData);
});


Vue.io.socket.on('connect', function () {
  console.log('Connected to server (SOCKET)');
});

Vue.io.socket.on('disconnect', function () {
  console.log('Lost connection to server (SOCKET)');
});

Vue.io.socket.on('onDisconnect', function () {
  console.log('Lost connection to server - onDisconnect (SOCKET)');
});

Vue.io.socket.on('afterDisconnect', function () {
  console.log('Lost connection to server - afterDisconnect (SOCKET)');
});