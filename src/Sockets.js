import Vue from 'vue'
import * as config from '@/api/config'
import { EventBus } from '@/event-bus.js'

import socketIOClient from 'socket.io-client'
import sailsIOClient from 'sails.io.js'
import vueSails from 'vue-sails'


let io = sailsIOClient(socketIOClient)

io.sails.url = config.SOCKET_API
io.sails.autoConnect = true

Vue.io = io

Vue.use(vueSails, io)

// Socket listeners

Vue.io.socket.on('message', (obj) => {
  Vue.$log.info('Sockets.js - message')
  Vue.$log.info(obj)
  if (obj.msg.tag) {
    EventBus.$emit('socketWebinarMessage', obj)
  }
  else {
    EventBus.$emit('socketConversationMessage', obj)
    EventBus.$emit('profileMessageReceived', obj)
  }
})

Vue.io.socket.on('classroom', (obj) => {
  Vue.$log.info('Sockets.js - classroom')
  Vue.$log.info(obj)
  EventBus.$emit('socketClassroom', obj)
})

Vue.io.socket.on('user', (obj) => {
  Vue.$log.info('Sockets.js - user')
  Vue.$log.info(obj)
  EventBus.$emit('socketUser', obj)
})