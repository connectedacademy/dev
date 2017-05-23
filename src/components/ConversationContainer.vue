<template lang="pug">

  .conversation-container(ref="conversationContainer" v-bind:class="{ 'message-priority': messagePriority }" v-bind:style="conversationContainerStyles")

    .spacer(ref="spacer" v-bind:style="spacerStyles")
      .floating-text
        h5 {{ $t('common.scroll_down_for_live_class') }}
        icon(name="angle-double-down" scale="2")

    //- Efficent
    .activity-visualisation(v-bind:style="activityVisualisationStyles")
      svg(width="200" v-bind:height="svgHeight")
        g
          path(v-bind:d="visualisationPoints")

      //- svg(width="200" v-bind:height="svgHeight")
        g(v-html="visualisationLabels")

    .subtitle-container(v-bind:style="subtitlesContainerStyles")

      subtitle(v-for="subtitle in subtitles" v-bind:subtitle="subtitle" v-bind:key="subtitle.start")

    .messages-container(v-bind:style="messagesContainerStyles")

      span(v-for="message in chunkedMessages" v-bind:key="message.segmentGroup")
        time-segment(v-bind:message="message")

    .clearfix

</template>

<script>
import Vue from 'vue';
import _ from 'lodash';
import { mapGetters } from 'vuex';
import API from '@/api';
import * as types from '@/store/mutation-types';

import Visualisation from '@/mixins/Visualisation';
import Subtitles from '@/mixins/Subtitles';

import TimeSegment from '@/components/conversation/TimeSegment';
import Subtitle from '@/components/conversation/Subtitle';

export default {
  /* eslint-disable */
  name: 'conversation-container',
  mixins: [
    Visualisation,
    Subtitles,
  ],
  mounted() {
    this.windowResized();
    const self = this;
    window.addEventListener('resize', () => {
      this.windowResized(self);
    });
  },
  watch: {
    messages() {
      this.updateChunkedMessages(this.currentSegmentGroup);
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

        API.message.getSubtitles(
          `${this.currentSection.slug}`,
          `${this.$store.getters.course.baseUri}${this.$store.getters.currentClass.dir}/${this.currentSection.transcript}`,
          function(response) {
            self.subtitles = response.response;
            // this.loadSubtitles();
          },
          function(response) {
            self.subtitles = response.response;
            // this.loadSubtitles();
          },
        );

        const request = {
          theClass: this.$store.getters.currentClass.slug,
          theContent: this.currentSection.slug,
        };

        this.$store.dispatch('getVisualisation', request);
      }
    },
  },
  methods: {
    windowResized(self) {

      if (this.$refs.spacer) {
        const windowHeight = window.innerHeight;
        const childOffset = this.$refs.spacer.parentElement.offsetTop;

        let height = (windowHeight - childOffset);

        this.spacerHeight = (height < 200) ? 200 : height;
      }
    },
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
      startSegment = (startSegment < 0) ? 0 : startSegment;

      // Think ahead..
      currentSegment += (1.0 / 0.2);

      const request = {
        theClass: this.currentClass.slug,
        theContent: this.content.slug,
        startSegment: `${startSegment}`,
        endSegment: `${currentSegment}`,
      };

      this.$store.dispatch('getMessagesSummary', request);
    },
    showComposer() {
      this.$store.commit(types.SHOW_COMPOSER);
    },
    updateChunkedMessages(currentSegment) {

      let segmentViewport = _.floor(window.innerHeight / 158.0);

      currentSegment += 1; // Think ahead
      segmentViewport += 2; // Think behind

      let startSegment = currentSegment - segmentViewport;
      startSegment = (startSegment < 5) ? 0 : startSegment;

      // this.$log.log(`** Updating chunked - ${startSegment} - ${currentSegment}`);

      let result = _.compact(this.messages.slice(startSegment, currentSegment));

      for (var i = 0; i < result.length; i += 1) {
        if (result[i].segmentGroup >= startSegment && result[i].segmentGroup <= currentSegment) {
          if (!(this.chunkedMessages[`${result[i].segmentGroup}`] && this.chunkedMessages[`${result[i].segmentGroup}`].message)) {
            Vue.set(this.chunkedMessages, `${result[i].segmentGroup}`, result[i]);
          }
        }
      }

      for (var i = 0; i < this.chunkedMessages.length; i += 1) {

        if (!(this.chunkedMessages[i].segmentGroup >= startSegment && this.chunkedMessages[i].segmentGroup <= currentSegment)) {
          this.chunkedMessages[i] = null;
        }
      }
    },
  },
  props: ['content'],
  computed: {
    ...mapGetters([
      'currentClass', 'currentSection', 'currentSegmentGroup', 'currentSegment', 'messages', 'visualisation',
    ]),
    containerHeight() {
      return ((this.content.duration * 0.2) * 158.0);
    },
    svgHeight() {
      return `${this.containerHeight}px`;
    },
    conversationContainerStyles() {
      return {
        height: `${(this.containerHeight + this.spacerHeight)}px`,
      };
    },
    messagesContainerStyles() {
      return {
        top: `${this.spacerHeight}px`,
      };
    },
    subtitlesContainerStyles() {
      return {
        top: `${this.spacerHeight}px`,
      };
    },
    activityVisualisationStyles() {
      return {
        top: `${this.spacerHeight}px`,
      };
    },
    spacerStyles() {
      return {
        height: `${this.spacerHeight}px`,
      };
    },
    visualisationPoints() {
      return this.points;
    },
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      messagePriority: true,
      spacerHeight: 0,
      points: '',
      subtitles: [],
      chunkedMessages: {},
    };
  },
  components: {
    Subtitle,
    TimeSegment,
  },
};
</script>

<style lang="stylus" scoped>

@import '../assets/stylus/shared/*'

.conversation-container
  background-color #f2f2f2
  overflow hidden
  position relative
  padding 0

  .spacer
    background-color white
    position relative
    .floating-text
      height 100px
      position absolute
      top 50%
      margin-top -50px
      text-align center
      width 100%
    .fa-icon
      height 40px
  h5
    nomargin()
    nopadding()
    color #444
    height 60px
    line-height 60px
    width 100%

  .activity-visualisation
    position absolute
    top 0
    left 0
    z-index 0
    svg
      path
        fill #e1e1e1

  .subtitle-container, .messages-container
    min-height 100px
    position absolute
    width 50%
    left 0
    top 0
    bottom 0

  .subtitle-container
    .time-segment
      background-color #f2f2f2

  .messages-container
    left 50%

  @media(max-width: 800px)
    .subtitle-container, .messages-container
      left 0
      width 100%
    &.message-priority
      .subtitle-container
        display none
    &.subtitle-priority
      .message-container
        display none

</style>
