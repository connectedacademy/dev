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
      if (typeof content.transcript === 'undefined') return
      
      Vue.$log.info('Getting transcript...')

      this.transcript = [] // Clear existing transcript

      API.message.getTranscript(
        {
          theClass: this.currentClass.slug,
          filename: content.transcript
        },
        response => {
          this.transcript = response
        }
      )
    }
  }
}
