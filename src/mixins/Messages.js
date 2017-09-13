import Vue from 'vue';
import API from '@/api';
import * as types from '@/store/mutation-types';
import { mapGetters } from 'vuex';

export default {
  mounted() {
    Vue.io.socket.on('message', (obj) => {
      console.log('message received over socket connection')
      console.log(obj);
      if (obj.msgtype === 'message') {
        
        // Update message
        const key = `${_.round(parseInt(obj.msg.segment) * 0.2)}`
        let updateMessage = this.messages[key]
        updateMessage.message = obj.msg

        // Increment total
        updateMessage.info.total = updateMessage.info.total + 1

        // Update messages object
        Vue.set(this.messages, key, updateMessage);

        // Update active segment messages
        if (this.currentSegmentGroup === `${_.round(parseInt(obj.msg.segment) * 0.2)}`) {
          this.$store.commit(types.PUSH_SEGMENT_MESSAGE, obj.msg);
        }
      }
    });
  },
  data() {
    return {
      messages: {},
    };
  },
  computed: {
    ...mapGetters([
      'currentClass', 'currentSection', 'currentSegmentGroup',
    ]),
    chunkedMessages() {
      return this.messages;
      // Uncomment to chunk
      // return _.pickBy(this.messages, (value, key) => {
      //   return _.inRange(parseInt(key), this.currentSegmentGroup - 20, this.currentSegmentGroup + 5);
      // });
    },
  },
  methods: {
    loadSegmentSummary(segmentGroup) {

      if (this.content === undefined) { return; }
      if (this.currentClass === undefined) { return; }
      if (this.currentSection === undefined) { return; }
      if (this.content.slug !== this.currentSection.slug) { return; }

      Vue.$log.info(`Getting message summary for - ${segmentGroup}`);

      let thinkAhead = 10; // Think ahead
      let thinkBehind = 10; // Think behind

      let segmentViewport = _.floor(window.innerHeight / 158.0) + thinkBehind;

      let endSegment = ((segmentGroup + thinkAhead) / 0.2);
      let startSegment = endSegment - (segmentViewport / 0.2);

      startSegment = (startSegment < 0) ? 0 : startSegment;
      endSegment = (endSegment < 5) ? 5 : endSegment;

      const theRequest = {
        theClass: this.currentClass.slug,
        theContent: this.content.slug,
        startSegment: `${parseInt(startSegment)}`,
        endSegment: `${parseInt(endSegment)}`,
      };

      if ((startSegment % 10) === 0) {
        API.message.getSegmentSummary(
          theRequest,
          response => {

            for (var group in response.data) {

              let newMessage = response.data[group];
              newMessage.segmentGroup = parseInt(parseInt(group) * 0.2);

              if (newMessage.segmentGroup < (this.content.duration * 0.2)) {
                Vue.set(this.messages, newMessage.segmentGroup, newMessage);
              }
            }
          },
          response => {
            Vue.$log.info('Failed to get messages summary');
          },
        );
      }

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
    },
  },
}
