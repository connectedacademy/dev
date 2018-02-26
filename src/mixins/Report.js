import Vue from 'vue'
import API from '@/api'

export default {
  methods: {
    reportItem(itemId) {
      
      API.moderation.reportItem(
        itemId,
        (response) => {
          alert('Reported!')
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