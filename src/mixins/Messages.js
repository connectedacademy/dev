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
      viewportConversationMessages: [],
      conversationMessages: (() => {
        const segmentCount = parseInt(this.content.duration / 5) + 1
        // let obj = {}
        // for (let i = 0; i < segmentCount; i++) {
        //   obj[i] = { loading: true, segmentGroup: i }
        // }
        // return obj
        return Array.apply(null, Array(segmentCount)).map((x, i) => { return { loading: true, segmentGroup: i } })
      })(),
      startSegment: 0,
      endSegment: 20
    }
  },
  mounted() {
    EventBus.$on('message', (message) => {
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
    ...mapGetters(['currentClass', 'user'])
  },
  methods: {
    loadSegmentSummary(segmentGroup, force) {
      Vue.$log.debug(`Getting message summary for - ${segmentGroup}`)

      const loadAhead = 10, loadBehind = 20

      const segmentViewport = _floor(window.innerHeight / this.$app.segmentHeight) + loadBehind

      const endSegment = (segmentGroup + loadAhead)
      const startSegment = endSegment - segmentViewport

      this.startSegment = _clamp(startSegment, -1, startSegment)
      this.endSegment = _clamp(endSegment, 10, endSegment)

      const theRequest = {
        theClass: this.currentClass.slug,
        theContent: this.content.slug,
        startSegment: this.startSegment,
        endSegment: this.endSegment
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
