import Vue from 'vue'
import API from '@/api'
import * as types from '@/store/mutation-types'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'
import store from '@/store'

import _clamp from 'lodash/clamp'
import _floor from 'lodash/floor'

export default {
  data() {
    return {
      conversationMessages: {},
    }
  },
  mounted() {
    EventBus.$on('message', (message) => {
      console.log('message', message)
      
      // Check if message is a reply to current user
      if (this.user) {
        if (message.text.indexOf(`@${this.user.twitter.username}`) !== -1) {
          EventBus.$emit('mention', message)
        }
      }

      if (message.class === this.$route.params.classSlug) {
        // Update messages
        Vue.set(this.conversationMessages, message.segment, message)

        // Update active segment messages
        if (this.peekSegment === parseInt(message.segment)) {
          Vue.$log.debug('Pushing message')
          store.commit(types.PUSH_SEGMENT_MESSAGE, message)
        }
      }
    })
  },
  computed: {
    ...mapGetters(['currentClass', 'user']),
  },
  methods: {
    loadSegmentSummary(segmentGroup, force) {
      Vue.$log.debug(`Getting message summary for - ${segmentGroup}`)

      let loadAhead = 5
      let loadBehind = 5

      let segmentViewport = _floor(window.innerHeight / this.$app.segmentHeight) + loadBehind

      let endSegment = (segmentGroup + loadAhead)
      let startSegment = endSegment - segmentViewport

      startSegment = _clamp(startSegment, 0, startSegment)
      endSegment = _clamp(endSegment, 5, endSegment)

      const theRequest = {
        theClass: this.currentClass.slug,
        theContent: this.content.slug,
        startSegment: startSegment,
        endSegment: endSegment
      }
      
      if (((endSegment % (endSegment - startSegment)) === 0) || force) {

        API.message.getSegmentSummary(
          theRequest,
          response => {
            for (let message of response) {
              Vue.set(this.conversationMessages, message.segmentGroup, message)
            }
          },
          response => {
            Vue.$log.debug('Failed to get messages summary')
          },
        )
      }
    },
  },
}
