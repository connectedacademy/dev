import Vue from 'vue'
import API from '@/api'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      prompts: {}
    }
  },
  computed: {
    ...mapGetters(['course', 'currentClass']),
  },
  methods: {
    loadPrompts(content) {
      Vue.$log.info('Getting prompts...')

      this.prompts = {} // Clear existing prompts

      API.message.getPrompts(
        this.currentClass.slug,
        response => {
          this.prompts = response
        }
      )
    }
  }
}
