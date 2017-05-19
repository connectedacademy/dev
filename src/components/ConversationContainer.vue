<template lang="pug">

  .conversation-container(ref="conversationContainer" v-bind:class="{ 'message-priority': messagePriority }" v-bind:style="conversationContainerStyles")

    .spacer(ref="spacer" v-bind:style="spacerStyles")
      .floating-text
        h5 {{ $t('common.scroll_down_for_live_class') }}
        icon(name="angle-double-down" scale="2")

    .activity-visualisation(v-bind:style="activityVisualisationStyles" v-bind:class="{ active: !canAutoScroll }")
      svg(width="200" v-bind:height="svgHeight")
        g
          path(v-bind:d="visualisationPoints")

      //- svg(width="200" v-bind:height="svgHeight")
        g(v-html="visualisationLabels")

    .subtitle-container

      subtitle(v-for="subtitle in subtitles" v-once v-bind:subtitle="subtitle" v-bind:key="subtitle.start")

    .messages-container

      .time-segment(v-for="message in chunkedMessages" v-bind:key="message.segmentGroup" v-bind:style="{ top: (message.segmentGroup * 158.0) + 'px' }")

        //- pre {{ message }}
        //- pre.hidden {{ ((message.segmentGroup / 5) * 158.0) }}

        //- .message-wrapper
        .message-count.animated.fadeIn(v-if="message && message.info" v-bind:class="{ none: (message.info.total === 0), low: (message.info.total > 0), medium: (message.info.total > 2), high: (message.info.total > 4) }")
          span(v-if="message.info.total !== 0") {{ message.info.total }}
          icon(name="twitter" v-if="message.info.total === 0")

        message(v-once v-if="message.info && (message.info.total > 0)" v-bind:message="message.message")

        .mock-message.animated.fadeIn(v-once v-if="message.loading || (message.info && (message.info.total === 0))" v-bind:class="{ loading: message.loading }")
          .mock-message--user
          .mock-message--body
            .mock-message--line
            .mock-message--line
            .mock-message--line

    //- .suggestion(v-if="chunkedMessages[segment] && chunkedMessages[segment].message && chunkedMessages[segment].message.suggestion")
          h3 {{ chunkedMessages[segment].message.text }}


    .clearfix

</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import * as types from '@/store/mutation-types';

import ScrollPoints from '@/mixins/ScrollPoints';
import Visualisation from '@/mixins/Visualisation';
import Subtitles from '@/mixins/Subtitles';

import Subtitle from './conversation/Subtitle';
import Message from './conversation/Message';

export default {
  /* eslint-disable */
  name: 'conversation-container',
  mixins: [
    ScrollPoints,
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
    currentSegmentGroup(nV, oV) {
      if (oV !== nV) {
        const backFill = 8;
        for (var i = 0; i < backFill; i++) {
          const segment = (nV - i);
          if (segment >= 0) {
            this.getMessagesSummary(segment);
          }
        }
      }
    },
    visualisation(nV, oV) {
      console.log('loadVisualisation');
      this.loadVisualisation(this.visualisation);
    },
    currentSection(nV, oV) {
      if (oV !== nV) {

        this.$store.dispatch('getSubtitles');

        // const request = {
        //   theClass: this.$store.getters.currentClass.slug,
        //   theContent: this.currentSection.slug,
        // };
        //
        // this.$store.dispatch('getVisualisation', request);
        //
        // if (!this.canAutoScroll) {
        //   if (oV !== nV) {
        //     if (nV.duration !== undefined) {
        //       this.$store.commit('setCanAutoScroll', true);
        //     }
        //   }
        // }


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

        var self = this;

        setTimeout(function() {
          self.setScrollPoints();
        }, 500);
      }
    },
    getMessagesSummary(segmentGroup) {

      if (this.chunkedMessages) {
        // Cancel request if we alredy have chunkedMessages for segment
        if (this.chunkedMessages[segmentGroup]) { return; }

        // Cancel request if we are scrolling!
        // if (!this.canAutoScroll) { return; }
      }

      const segmentCount = (1.0 / 0.2);
      const startSegment = (segmentGroup * segmentCount) - ((segmentGroup * segmentCount) % segmentCount);
      const endSegment = (startSegment) + (segmentCount - 1);

      const request = {
        theClass: this.$store.getters.currentClass.slug,
        theContent: this.content.slug,
        startSegment: `${startSegment}`,
        endSegment: `${endSegment}`,
      };

      if (((startSegment % segmentCount) === 0) && (this.content.slug === this.$store.getters.currentSection.slug)) {
        this.$store.dispatch('getMessagesSummary', request);
      }
    },
    showComposer() {
      this.$store.commit(types.SHOW_COMPOSER);
    },
  },
  props: ['content'],
  computed: {
    ...mapGetters([
      'currentClass', 'currentSegmentGroup', 'currentSegment', 'isRegistered', 'chunkedMessages', 'canAutoScroll', 'currentSection', 'subtitles', 'visualisation',
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
      // subtitles: [],
    };
  },
  components: {
    Subtitle,
    Message,
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
        animate()
    &.active
      svg
        path
          fill #ddd

  .subtitle-container, .messages-container
    float left
    min-height 100px
    position relative
    width 50%

    .time-segment
      height 158px
      position absolute
      left 0
      right 0
      top 0
      .message-count
        radius(13px)
        background-color $color-primary
        color white
        font-size 0.8em
        line-height 14px
        min-width 14px
        padding 6px
        position absolute
        text-align center
        top 5px
        right 5px
        &.none
          background-color #CCC
        &.low
          background-color $color-success
        &.medium
          background-color $color-warning
        &.high
          background-color $color-danger
      p.timestamp-label
        radius(20px)
        background-color $color-primary
        color white
        display inline-block
        line-height 40px
        min-width 20px
        margin 5px
        padding 0 10px
        text-align center

  .subtitle-container
    .time-segment
      background-color #f2f2f2

  .messages-container
    width 50%
    .time-segment
      overflow hidden

  @media(max-width: 600px)
    &.message-priority
      .subtitle-container
        display none
        width 50px
      .messages-container
        display block
        width 100%

.mock-message
  height 120px
  padding-left 60px
  position absolute
  top 0
  left 0
  right 0
  animate()
  .mock-message--user
    radius(50%)
    height 40px
    width 40px
    position absolute
    top 20px
    left 15px
  .mock-message--body
    radius(6px)
    height 100px
    padding 10px
    .mock-message--line
      radius(6px)
      height 20px
      margin-top 15px
      &:first-child
        max-width 100px
  .mock-message--user, .mock-message--line
    background-color #e1e1e1
  &.loading
    .mock-message--user, .mock-message--line
      background-color #d9d9d9

</style>
