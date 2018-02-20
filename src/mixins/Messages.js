import Vue from 'vue'
import API from '@/api'
import * as types from '@/store/mutation-types'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'
import store from '@/store'

import _fill from 'lodash/fill'
import _get from 'lodash/get'
import _floor from 'lodash/floor'
import _round from 'lodash/round'

export default {
  data() {
    return {
      conversationMessages: {},
    }
  },
  mounted() {
    EventBus.$on('socketConversationMessage', (obj) => {
      console.log('socketConversationMessage')
      console.log(obj)
      console.log(this.conversationMessages)

      const key = `${parseInt(obj.msg.segment)}`
      let updateMessage = this.conversationMessages[key]

      if (true || updateMessage) {

        // Update message
        updateMessage.message = obj.msg

        // Increment total
        const total = _get(updateMessage, ['info', 'total'], undefined)
        if (typeof total !== 'undefined') {
          updateMessage.info.total = updateMessage.info.total + 1
        }

        // Update messages object
        Vue.set(this.conversationMessages, key, updateMessage)

        // Update active segment messages
        if (this.peekSegment === parseInt(obj.msg.segment)) {
          Vue.$log.debug('Pushing message')
          store.commit(types.PUSH_SEGMENT_MESSAGE, obj.msg)
        }
      }
    })
  },
  computed: {
    ...mapGetters([
      'currentClass', 'currentSection'
    ]),
  },
  methods: {
    loadSegmentSummary(segmentGroup, force) {
      Vue.$log.debug(`Getting message summary for - ${segmentGroup}`)

      if (this.content === undefined) { Vue.$log.debug('loadSegmentSummary aborted'); return }
      if (this.currentClass === undefined) { Vue.$log.debug('loadSegmentSummary aborted'); return }

      let thinkAhead = 5 // Think ahead
      let thinkBehind = 5 // Think behind

      let segmentViewport = _floor(window.innerHeight / this.$app.segmentHeight) + thinkBehind

      let endSegment = (segmentGroup + thinkAhead)
      let startSegment = endSegment - segmentViewport

      startSegment = (startSegment < 0) ? 0 : startSegment
      endSegment = (endSegment < 5) ? 5 : endSegment

      const theRequest = {
        theClass: this.currentClass.slug,
        theContent: this.content.slug,
        startSegment: startSegment,
        endSegment: endSegment
      }

      this.$io.socket.get(`/v1/messages/subscribe/${theRequest.theClass}/${theRequest.theContent}/${theRequest.startSegment}/${theRequest.endSegment}?whitelist=true`, function (resData, jwres) {
        store.commit('SET_SUBSCRIBED_TO', { start: theRequest.startSegment, end: theRequest.endSegment })
        Vue.$log.debug('SOCKET RESPONSE - subscribe');
        // alert('SOCKET RESPONSE - subscribe');
        Vue.$log.debug(resData);
      })
      
      if (((endSegment % (endSegment - startSegment)) === 0) || force) {

        API.message.getSegmentSummary(
          theRequest,
          response => {
            
            for (var group in response.data) {

              let newMessage = response.data[group]
              newMessage.segmentGroup = parseInt(group)

              // Check does not fall out of wrapper height
              if ((newMessage.segmentGroup * this.$app.segmentHeight) < (this.$refs.innerwrapper.offsetHeight - 200)) {
                if (typeof this.$refs.innerwrapper === 'undefined') continue
                Vue.set(this.conversationMessages, newMessage.segmentGroup, newMessage)
              }
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
