import Vue from 'vue'
import * as config from '@/api/config'

export default {
    logEvent(request, cb, errorCb) {
        Vue.http.post(`${config.API}/analytics/log`, request).then((response) => {
            cb(response.body)
        }, (response) => {
            errorCb(response)
        })
    }
}
