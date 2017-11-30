import Vue from 'vue'
import API from '@/api'
import { mapGetters } from 'vuex'

export default {
  props: ['content'],
  data() {
    return {
      visualisation: undefined
    }
  },
  methods: {
    loadVisualisation() {

      const request = { class: this.currentClass.slug, content: this.content.slug, duration: this.content.duration }

      API.visualisation.getVisualisation(
        request,
        (response) => {
          this.visualisation = response.data
        },
        response => (response) => {
          Vue.$log.error(response)
          Vue.$log.info('Failed to check auth')
          this.visualisation = undefined
        }
      )
    }
  }
}
