import Vue from 'vue'
import * as config from '@/api/config'

export default {
  getPending(cb, errorCb) {
    Vue.http.get(`${config.API}/moderation/pending`).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  },
  reportItem(id, cb, errorCb) {
    Vue.http.post(`${config.API}/moderation/report`, { item: id }).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  },
  updateState(id, state, cb, errorCb) {
    Vue.http.post(`${config.API}/moderation/change/${id}`, { moderationstate: status }).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  }
}