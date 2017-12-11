import Vue from 'vue'
import API from '@/api'
import * as config from '@/api/config'

export default {
  props: ['content'],
  data() {
    return {
      visualisation: undefined,
      newVisualisation: undefined
    }
  },
  methods: {
    loadVisualisation() {

      const request = { class: this.currentClass.slug, content: this.content.slug, duration: this.content.duration }

      // Subscribe to visualisation socket
      this.$io.socket.get(`${config.WATERCOOLER_API}/messages/visualisation/${request.class}/${request.content}/5/${request.duration}?whitelist=true&clearcache=false&scale=log`, (resData, jwres) => {
        this.visualisation = resData.data
      })

      // Standard request for visualisation
      API.visualisation.getVisualisation(
        request,
        (response) => {
          this.visualisation = response.data
        },
        (response) => {
          Vue.$log.error(response)
          Vue.$log.info('Failed to check auth')
          this.visualisation = undefined
        }
      )
    }
  }
}
