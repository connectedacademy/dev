import Vue from 'vue'
import * as config from '@/api/config'

export default {
  getClassrooms(theClass, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/teacher/classrooms/${theClass}`).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  },
  getMessages(theClass, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/teacher/messages/${theClass}`).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  },
  getStudents(theClass, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/teacher/students/${theClass}`).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  },
  getHomework(theClass, cb, errorCb) {
    Vue.http.get(`${config.WATERCOOLER_API}/teacher/homework/${theClass}`).then((response) => {
      cb(response.body)
    }, (response) => {
      errorCb(response)
    })
  }
}