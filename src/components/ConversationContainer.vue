<template lang="pug">

  .conversation-container(ref="conversationContainer" v-if="isRegistered" v-bind:class="{ 'message-priority': messagePriority }" v-bind:style="conversationContainerStyles")

    .spacer(ref="spacer" v-bind:style="spacerStyles")
      .floating-text
        h5 {{ $t('common.scroll_down_for_live_class') }}
        icon(name="angle-double-down" scale="2")

    .activity-visualisation(v-bind:style="activityVisualisationStyles")
      svg(width="200" v-bind:height="(segments.length * 158.0)")
        g
          path(v-bind:d="visualisationPoints")

      //- svg(width="200" v-bind:height="(segments.length * 158.0)")
        g(v-html="visualisationLabels")

    .subtitle-container

      subtitle(v-for="subtitle in subtitles" v-bind:key="subtitle.id" v-bind:subtitle="subtitle")

    .messages-container

      .time-segment(v-for="(index, segment) in segments")

        .message-wrapper(v-if="messages && messages[segment]")

          .message-count(v-bind:class="{ none: (messages[segment].info.count === 0), low: (messages[segment].info.count > 0), medium: (messages[segment].info.count > 2), high: (messages[segment].info.count > 4) }") {{ messages[segment].info.count }}

          message(v-if="messages[segment].info.count > 0" v-bind:message="messages[segment].message")

    .clearfix

</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import * as types from '@/store/mutation-types';

import ScrollPoints from '@/mixins/ScrollPoints';

import Subtitle from './conversation/Subtitle';
import Message from './conversation/Message';

export default {
  /* eslint-disable */
  name: 'conversation-container',
  mixins: [
    ScrollPoints,
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
        this.getMessagesSummary(nV);
      }
    },
  },
  methods: {
    windowResized(self) {
      console.log('Window resized');

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
      const length = 5;

      let startSegment = (segmentGroup * 5);
      startSegment -= (startSegment % 5);

      startSegment -= 5;

      let endSegment = (startSegment) + (length - 1);
      // startSegment = (startSegment > 20) ? (startSegment - 20) : 0;

      console.log(`Segment - ${startSegment}`);

      const request = {
        theClass: this.$store.getters.currentClass.slug,
        theContent: this.content.slug,
        startSegment: `${startSegment}`,
        endSegment: `${endSegment}`,
      };

      if (((startSegment % length) === 0) && (this.content.slug === this.$store.getters.currentSection.slug)) {
      // if (this.content.slug === this.$store.getters.currentSection.slug) {
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
      'currentClass', 'currentSegmentGroup', 'currentSegment', 'visualisationPoints', 'visualisationLabels', 'isRegistered', 'messages', 'subtitles',
    ]),
    conversationContainerStyles() {
      return {
        height: `${((this.segments.length * 158.0) + this.spacerHeight)}px`,
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
    segments() {
      // Calculate number of segments
      return _.map(_.range(_.ceil(this.content.duration * 0.2)), function () { return undefined; });
    },
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      messagePriority: true,
      spacerHeight: 0,
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
  min-height 100px
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
        stroke black // $color-primary
        fill black // $color-primary
        /*stroke-width 2px*/
        opacity 0.15

  .subtitle-container, .messages-container
    float left
    min-height 158px
    position relative
    width 50%

    .time-segment
      border-color transparent
      height 158px
      position relative
      animate()
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
      border-right transparent 3px solid
      overflow hidden
      animate()
      &.active
        border-right-color $color-primary

  @media(max-width: 600px)
    &.message-priority
      .subtitle-container
        display none
        width 50px
      .messages-container
        display block
        width 100%

</style>
