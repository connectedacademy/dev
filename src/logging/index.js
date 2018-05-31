import Vue from 'vue'
import API from '@/api'

export default {
  logEvent(...args) {
    
    return
    // TODO: Enable logging

    let [category, action, label, value] = args
    
    // Log on google analytics
    Vue.$ga.event(...args)
    
    // Setup request
    const request = {
      type: 'event',
      payload: {
        category, action, label, value
      }
    }
    
    // Log on server
    API.logging.logEvent(
      request,
      (response) => {
        Vue.$log.info('Logged event')
      },
      (response) => {
        // TODO: Better handle failed request
        Vue.$log.error(response)
        Vue.$log.info('Failed to log event')
      }
    )

  }
}