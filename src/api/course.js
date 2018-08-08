import Vue from 'vue'
import * as config from '@/api/config'

export default {
  getCourse(cb, errorCb) {
    Vue.http.get(`${config.API}/course`).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  },
  getClass(classSlug, cb, errorCb) {
    if (!classSlug) return
    if (classSlug === 'intro') return
    Vue.http.get(`${config.API}/class/${classSlug}`).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  },
  getHubs(cb, errorCb) {
    Vue.http.get(`${config.API}/course/hubs`).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  },
  getLikeCount(request, cb, errorCb) {
    Vue.http.get(`${config.API}/messages/likes/${request.class}/${request.content}`).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  },
  uploadAudio(postData, cb, errorCb) {
    Vue.http.options = { credentials: true, responseType: 'json' }
    Vue.http.post(`${config.API}/audio/upload`, postData).then((response) => {
      cb(response)
    }, (response) => {
      errorCb(response)
    })
  },
  uploadMedia(postData, cb, errorCb) {
    Vue.http.options = { credentials: true, responseType: 'json' }
    Vue.http.post(`${config.API}/media/upload`, postData).then((response) => {
      cb(response)
    }, (response) => {
      errorCb(response)
    })
  },
  fetchTranscript(classSlug, cb, errorCb) {
    Vue.http.get(`${config.API}/transcription/fetch/${classSlug}`).then((response) => {
      cb(response)
    }, (response) => {
      errorCb(response)
    })
  }
}
