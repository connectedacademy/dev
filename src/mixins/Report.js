import Vue from 'vue'
import API from '@/api'

export default {
  methods: {
    reportItem(itemId) {
      const r = confirm('Report item?')
      if (!r) return
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