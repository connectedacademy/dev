import Vue from 'vue'
import API from '@/api'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      transcript: []
    }
  },
  computed: {
    ...mapGetters(['course', 'currentClass']),
  },
  methods: {
    loadTranscript(content) {
      Vue.$log.info('Getting transcript...')

      this.transcript = [] // Clear existing transcript

      API.message.getTranscript(
        {
          theClass: this.currentClass.slug
        },
        response => {
          this.transcript = response
        }
      )
    }
  }
}
