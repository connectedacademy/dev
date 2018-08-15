import Vue from 'vue'
import * as config from '@/api/config'

export default {
  save(request, cb, errorCb) {
    Vue.http.post(`${config.API}/editor/save/${request.type}`, request).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  }
}