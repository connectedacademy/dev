import Vue from 'vue'
import * as config from '@/api/config'

export default {
  getClassrooms(theClass, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/admin/classrooms/${theClass}`).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  },
  getMessages(theClass, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/admin/messages/${theClass}`).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  },
  getStudents(theClass, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/admin/students/${theClass}`).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  },
  getHomework(theClass, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/admin/homework/${theClass}`).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  }
}