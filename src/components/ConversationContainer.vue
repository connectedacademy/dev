<template lang="pug">

  .conversation-container(ref="conversationContainer")

    #the-toggle(@click="messagePriority = !messagePriority" v-bind:class="{ 'message-priority': messagePriority}")
      icon(name="quote-right")
      icon(name="twitter")

    //- Efficent
    #activity-visualisation(v-if="activeSegment")
      svg(width="400" v-bind:height="containerHeight")

        g
          //- line(x1="100" y1="0" x2="100" v-bind:y2="svgHeight")
          //- path(v-bind:d="visualisationPoints" transform="translate(102,0)")
          path(v-bind:d="visualisationPoints" transform="translate(400,0)")

      //- svg(width="200" v-bind:height="svgHeight")
        g(v-html="visualisationLabels")

    .inner-wrapper(v-bind:style="{ height: containerHeight }", v-bind:class="{ 'message-priority': messagePriority }")
      time-segment(v-for="message in chunkedMessages" v-bind:key="message.id" v-bind:message="message")

      .clearfix

</template>

<script>
import Vue from 'vue';
import _ from 'lodash';
import { mapGetters } from 'vuex';
import API from '@/api';
import * as types from '@/store/mutation-types';
import axios from 'axios';
import Moment from 'moment';

import Media from '@/mixins/Media';
import Subtitles from '@/mixins/Subtitles';
import Visualisation from '@/mixins/Visualisation';

import TimeSegment from '@/components/conversation/TimeSegment';

export default {
  /* eslint-disable */
  name: 'conversation-container',
  mixins: [
    Media,
    Subtitles,
    Visualisation,
  ],
  props: ['content'],
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      spacerHeight: 0,
      points: '',
      // subtitles: [],
      media: [],
      chunkedMessages: {},
      cancelSources: [],
      cancel: undefined,
      messagePriority: true,
    };
  },
  components: {
    TimeSegment,
  },
  mounted() {
    const self = this;

    setInterval(function() {

      self.updateChunkedMessages(self.currentSegmentGroup);

    }, 2000);
  },
  watch: {
    'messages': {
      handler: function(nV, oV) {
        this.updateChunkedMessages(this.currentSegmentGroup);
      },
      deep: true,
    },
    'lastMessage': {
      handler: function(nV, oV) {
        var self = this;
        setTimeout(function() {
          this.$log.log('UPDATING');
          self.updateChunkedMessages(self.currentSegmentGroup);
        }, 500);
      },
      deep: true,
    },
    currentSegmentGroup(nV, oV) {
      if (nV === undefined) { return; }
      if (oV !== nV) {
        this.$log.log(`Getting messages for segment ${nV}`);

        this.getMessagesSummary(nV);
      }
    },
    visualisation(nV, oV) {
      this.loadVisualisation(this.visualisation);
    },
    currentSection(nV, oV) {
      if (nV === undefined) { return; }
      if (oV !== nV) {
        var self = this;

        // API.message.getSubtitles(
        //   `${this.currentSection.slug}`,
        //   `${this.$store.getters.course.baseUri}${this.$store.getters.currentClass.dir}/${this.currentSection.transcript}`,
        //   function(response) {
        //     self.subtitles = response.response;
        //     // this.loadSubtitles();
        //   },
        //   function(response) {
        //     self.subtitles = response.response;
        //     // this.loadSubtitles();
        //   },
        // );

        const request = {
          theClass: this.$store.getters.currentClass.slug,
          theContent: this.currentSection.slug,
        };

        // TODO: Remove hardcoded value
        const images = 'transcripts/SI0kWdWG0JY_images.json';

        this.$store.dispatch('getMedia', { slug: `${this.currentSection.slug}`, path: `${this.$store.getters.course.baseUri}${this.$store.getters.currentClass.dir}/${images}` });

        this.$store.dispatch('getVisualisation', request);

        this.$store.dispatch('getSubtitles', request);
      }
    },
  },
  methods: {
    getMessagesSummary(segmentGroup) {

      if (this.content === undefined) { return; }
      if (this.currentClass === undefined) { return; }
      if (this.currentSection === undefined) { return; }
      if (this.content.slug !== this.currentSection.slug) { return; }

      this.$log.log(`Getting message summary for - ${segmentGroup}`);

      let segmentViewport = _.floor(window.innerHeight / 158.0);
      // segmentViewport += 2; // Think behind

      let currentSegment = (segmentGroup / 0.2);
      let startSegment = currentSegment - (segmentViewport / 0.2);

      // Think ahead..
      currentSegment += (5 * (1.0 / 0.2));

      startSegment = (startSegment < 0) ? 0 : startSegment;
      currentSegment = (currentSegment < 5) ? 5 : currentSegment;

      const request = {
        theClass: this.currentClass.slug,
        theContent: this.content.slug,
        startSegment: `${startSegment}`,
        endSegment: `${currentSegment}`,
      };

      this.$store.dispatch('getMessagesSummary', { request: request });
    },
    showComposer() {
      this.$store.commit(types.SHOW_COMPOSER);
    },
    updateChunkedMessages(currentSegment) {

      let segmentViewport = _.floor(window.innerHeight / 158.0);

      currentSegment += 1; // Think ahead
      segmentViewport += 3; // Think behind

      let startSegment = currentSegment - segmentViewport;
      startSegment = (startSegment < 5) ? 0 : startSegment;

      this.$log.log(`** Updating chunked - ${startSegment} - ${currentSegment}`);

      let result = _.compact(this.messages.slice(startSegment, currentSegment));

      for (var i = 0; i < result.length; i += 1) {
        if (result[i].segmentGroup >= startSegment && result[i].segmentGroup <= currentSegment) {
          // if (!(this.chunkedMessages[`${result[i].segmentGroup}`] && this.chunkedMessages[`${result[i].segmentGroup}`].message)) {
            Vue.set(this.chunkedMessages, `${result[i].segmentGroup}`, result[i]);
          // }
        }
      }

      for (var i = 0; i < this.chunkedMessages.length; i += 1) {

        if (!(this.chunkedMessages[i].segmentGroup >= startSegment && this.chunkedMessages[i].segmentGroup <= currentSegment)) {
          this.chunkedMessages[i] = null;
        }
      }
    },
  },
  computed: {
    ...mapGetters([
      'currentClass', 'currentSection', 'currentSegmentGroup', 'currentSegment', 'messages', 'visualisation', 'lastMessage', 'subtitles', 'activeSegment',
    ]),
    containerHeight() {
      return `${(((this.content.duration) * 0.2) * 158.0) + 400}px`;
    },
    visualisationPoints() {
      return this.points;
    },
    chunkedSubtitles() {
      return _.compact(this.subtitles);
    },
  },
};
</script>

<style lang="stylus">

@import '~stylus/shared'

.conversation-container
  background-color white
  position relative

  &.collapsed
    max-height 600px
    overflow hidden

  h5
    reset()
    color #444
    height 60px
    line-height 60px
    width 100%

  #activity-visualisation
    pointer-events none
    position absolute
    right 0
    top 0
    z-index 0

    svg
      overflow visible
      line
        stroke alpha($color-primary, 1)
        stroke-width 4
      path
        fill alpha($color-primary, 1)

    @media(max-width: 600px)
      z-index 50
      left -400px
      right auto

      svg path
        fill alpha($color-primary, 0.3)


  .inner-wrapper
    overflow hidden
    .subtitle-wrapper
      animate()
      width 50%
      transform translate(0%, -50%)
    .message-wrapper
      animate()
      width 50%
      transform translate(100%, -50%)
    @media(max-width: 600px)
      .subtitle-wrapper
        animate()
        width 100%
        transform translate(0%, -50%)
      .message-wrapper
        animate()
        width 100%
        transform translate(100%, -50%)
      &.message-priority
        .subtitle-wrapper
          animate()
          width 100%
          transform translate(-100%, -50%)
        .message-wrapper
          animate()
          width 100%
          transform translate(0%, -50%)

#the-toggle
  animate()
  radius(50%)
  background-color $color-primary
  color white
  display none
  height 80px
  width 80px
  position fixed
  z-index 57
  top 50%
  left calc(100% - 40px)
  transform translate(0%, -50%)
  text-align left
  @media(max-width: 600px)
    display block
  .fa-icon
    animate()
    float left
    height 80px
    padding 0 10px
    width 20px

  &.message-priority
    left -40px
    transform translate(0%, -50%)

</style>
