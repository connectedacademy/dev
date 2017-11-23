import Vue from 'vue'
import * as config from '@/api/config'

export default {
  getMessages(theClass, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/profile/messages/${theClass}`).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  },
  getHomework(theClass, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/profile/homework/${theClass}`).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  }
}
