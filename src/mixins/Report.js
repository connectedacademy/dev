import Vue from 'vue'
import API from '@/api'

import 'vue-awesome/icons/exclamation-circle'
import 'vue-awesome/icons/ellipsis-h'

export default {
  methods: {
    reportItem(itemId) {
      
      alert(`Reporting item with id - ${itemId}`)

      API.moderation.reportItem(
        itemId,
        (response) => {
          alert('Your report has been sent!')
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.error(response)
          alert('Your report failed to send')
        }
      )
    }
  }
}