import Vue from 'vue';
import API from '@/api';
import * as types from '@/store/mutation-types';
import { mapGetters } from 'vuex';

import _fill from 'lodash/fill';
import _get from 'lodash/get';
import floor from 'lodash/floor';
import round from 'lodash/round';

export default {
  mounted() {

    Vue.io.socket.on('message', (obj) => {
      Vue.$log.info('message socket');
      Vue.$log.info(obj);
      
      if (obj.msgtype === 'message') {

        const key = `${round(parseInt(obj.msg.segment) * 0.2)}`;
        let updateMessage = this.conversationMessages[key];
        
        if (!obj.msg.tag && updateMessage) {

          // Update message
          updateMessage.message = obj.msg;

          // Increment total
          const total = _get(updateMessage, ['info', 'total'], undefined);
          if (typeof total !== 'undefined') {
            updateMessage.info.total = updateMessage.info.total + 1;
          }

          // Update messages object
          Vue.set(this.conversationMessages, key, updateMessage);

          // Update active segment messages
          if (this.peekSegment === round(parseInt(obj.msg.segment) * 0.2)) {
            Vue.$log.info('Pushing message');
            this.$store.commit(types.PUSH_SEGMENT_MESSAGE, obj.msg);
          }
        }
        
        if (obj.msg.tag === `${this.classSlug}/${this.contentSlug}`) {

          Vue.$log.info('message received over socket connection')
          Vue.$log.info(obj);

          Vue.$log.info('Pushing message to webinar ticker');
          this.webinarMessages.push(obj.msg);
        }
      }
    });
  },
  data() {
    return {
      conversationMessages: {},
    };
  },
  computed: {
    ...mapGetters([
      'currentClass', 'currentSection'
    ]),
  },
  methods: {
    loadSegmentSummary(segmentGroup, force) {
      Vue.$log.info(`Getting message summary for - ${segmentGroup}`);

      if (this.content === undefined) { Vue.$log.info('loadSegmentSummary aborted'); return; }
      if (this.currentClass === undefined) { Vue.$log.info('loadSegmentSummary aborted'); return; }

      let thinkAhead = 5; // Think ahead
      let thinkBehind = 5; // Think behind

      let segmentViewport = floor(window.innerHeight / this.$app.segmentHeight) + thinkBehind;

      let endSegment = ((segmentGroup + thinkAhead) / 0.2);
      let startSegment = endSegment - (segmentViewport / 0.2);

      startSegment = (startSegment < 0) ? 0 : startSegment;
      endSegment = (endSegment < 5) ? 5 : endSegment;

      const theRequest = {
        theClass: this.currentClass.slug,
        theContent: this.content.slug,
        startSegment: startSegment,
        endSegment: endSegment
      };
      
      if (((endSegment % (endSegment - startSegment)) === 0) || force) {

        // Fill with blank messages
        // for (var index = (startSegment * 0.2); index < (endSegment * 0.2); index++) {
        //   if (this.conversationMessages[index]) continue;
        //   Vue.set(this.conversationMessages, index, { loading: true, segmentGroup: index });
        // }
        API.message.getSegmentSummary(
          theRequest,
          response => {
            
            for (var group in response.data) {

              let newMessage = response.data[group];
              newMessage.segmentGroup = (parseInt(group) * 0.2);

              // Check does not fall out of wrapper height
              if ((newMessage.segmentGroup * this.$app.segmentHeight) < (this.$refs.innerwrapper.offsetHeight - 200)) {
                Vue.set(this.conversationMessages, newMessage.segmentGroup, newMessage);
              }
            }
          },
          response => {
            Vue.$log.info('Failed to get messages summary');
          },
        );

        API.message.getSegmentSummarySocket(
          theRequest,
          response => {
            Vue.$log.info('Subscribed to messages summary');
            Vue.$log.info(theRequest);
          },
          response => {
            Vue.$log.info('Failed to subscribe to messages summary');
          },
        );
      }
    },
  },
}
