import Vue from 'vue'
import API from '@/api'

import { mapGetters } from 'vuex'

import _filter from 'lodash/filter'

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
