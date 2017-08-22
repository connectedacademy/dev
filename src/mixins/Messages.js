import Vue from 'vue';
import API from '@/api';
import { mapGetters } from 'vuex';

export default {
  mounted() {
    Vue.io.socket.on('message', function (obj) {
      alert('SOCKET - message');
      console.log('SOCKET - message');
      console.log(obj);
      Vue.set(this.messages, _.round(obj.segment * 0.2), obj);
    });
  },
  data() {
    return {
      messages: {},
    };
  },
  computed: {
    ...mapGetters([
      'currentClass', 'currentSection', 'currentSegmentGroup', 'lastMessage',
    ]),
    chunkedMessages() {
      return this.messages;
      // Uncomment to chunk
      // return _.pickBy(this.messages, (value, key) => {
      //   return _.inRange(parseInt(key), this.currentSegmentGroup - 20, this.currentSegmentGroup + 5);
      // });
    },
  },
  // watch: {
  //   'lastMessage': {
  //     handler: function (nV, oV) {
  //       setTimeout(() => { this.loadSegmentSummary(this.currentSegmentGroup) }, 600);
  //     },
  //     deep: true,
  //   },
  // },
  methods: {
    loadSegmentSummary(segmentGroup) {

      if (this.content === undefined) { return; }
      if (this.currentClass === undefined) { return; }
      if (this.currentSection === undefined) { return; }
      if (this.content.slug !== this.currentSection.slug) { return; }

      Vue.$log.info(`Getting message summary for - ${segmentGroup}`);

      let thinkAhead = 4; // Think ahead
      let thinkBehind = 10; // Think behind

      let segmentViewport = _.floor(window.innerHeight / 158.0) + thinkBehind;

      let endSegment = ((segmentGroup + thinkAhead) / 0.2);
      let startSegment = endSegment - (segmentViewport / 0.2);

      startSegment = (startSegment < 0) ? 0 : startSegment;
      endSegment = (endSegment < 5) ? 5 : endSegment;

      const theRequest = {
        theClass: this.currentClass.slug,
        theContent: this.content.slug,
        startSegment: parseInt(startSegment),
        endSegment: parseInt(endSegment),
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
    loadSegmentMessages() {

      Vue.$log.info('Loading segment messages');

      let theContent =  (this.message.message && this.message.message.content) ? this.message.message.content : this.$store.getters.currentSection.slug;

      const theRequest = {
        theClass: this.$store.getters.currentClass.slug,
        theContent: theContent,
        startSegment: `${parseInt(this.message.segmentGroup) / 0.2}`,
        endSegment: `${parseInt(this.message.segmentGroup) / 0.2 + 5}`,
      };

      API.message.getMessages(
        theRequest,
        response => {
          // Filter out highlighted message
          let filteredMessages = response.data;
          filteredMessages = _.filter(filteredMessages, (obj) => {
            return obj.id !== this.message.message.id;
          });
          filteredMessages = _.orderBy(filteredMessages, ['createdAt'], ['desc']);
          this.segmentMessages = filteredMessages;
        },
        response => {
          alert('There was an error');
          this.segmentMessages = [];
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

    },
  },
}
