import Vue from 'vue'
import API from '@/api'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      suggestions: []
    }
  },
  computed: {
    ...mapGetters(['course', 'currentClass']),
  },
  methods: {
    loadSuggestions(content) {
      Vue.$log.info('Getting suggestions...')

      this.suggestions = [] // Clear existing suggestions

      API.message.getSuggestions(
        this.currentClass.slug,
        response => {
          this.suggestions = response
        }
      )
    }
  }
}
