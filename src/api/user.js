import Vue from 'vue'
import * as config from '@/api/config'

export default {
  getMessages(theClass, cb, errorCb) {
    Vue.http.get(`${config.API}/user/messages/${theClass}`).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  },
  getHomework(theClass, cb, errorCb) {
    Vue.http.get(`${config.API}/user/homeworks/${theClass}`).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  }
}
