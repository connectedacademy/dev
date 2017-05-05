<template lang="pug">

  .conversation-container(ref="conversationContainer" v-if="isRegistered" v-bind:class="{ 'message-priority': messagePriority }" v-bind:style="conversationContainerStyles")

    .subtitle-container

      .activity-visualisation
        svg(width="200" v-bind:height="(segments.length * 158.0)")
          g
            polygon(v-bind:points="visualisationPoints")

      subtitle(v-for="subtitle in subtitles" v-bind:key="subtitle.id" v-bind:subtitle="subtitle")

    .messages-container

      .time-segment(v-for="(segment, index) in segments" v-bind:class="{ active: (currentSegmentGroup === index) }")

        .message-count(v-if="messages && messages[index]")
          | {{ messages[index].length }}

        span(v-if="messages && messages[index]")
          message(v-for="message in messages[index]" v-bind:key="message.id" v-bind:message="message")

    .clearfix

</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import * as types from '../store/mutation-types';

import Subtitle from './conversation/Subtitle';
import Message from './conversation/Message';

export default {
  /* eslint-disable */

  name: 'conversation-container',
  mounted() {
    this.setScrollPoints();
  },
  ready() {
    this.$nextTick(() => {
      this.getPosition();
    });
  },
  watch: {
    currentSegmentGroup(oldVal, newVal) {
      if (oldVal !== newVal) {
        // this.getMessages((newVal * 5));
      }
    },
    currentSegment(oldVal, newVal) {
      if (oldVal !== newVal) {
        this.getMessages(newVal);
      }
    },
  },
  methods: {
    setScrollPoints() {
      const element = this.$refs.conversationContainer;

      this.$store.commit('setScrollPoint', {
        slug: this.content.slug,
        top: (element.offsetParent.offsetTop + element.offsetTop),
        bottom: (element.offsetParent.offsetTop + element.offsetTop) + element.offsetHeight,
        duration: this.content.duration,
        videoId: this.content.video,
        transcript: this.content.transcript,
      });
    },
    getMessages(segment) {
      console.log(`Segment - ${segment}`);
      const length = 5
      const request = {
        theClass: this.$store.getters.currentClass.slug,
        theContent: this.content.slug,
        startSegment: `${segment}`,
        endSegment: `${(segment) + length}`,
      };

      if (((segment % length) === 0) && (this.content.slug === this.$store.getters.currentSection.slug)) {
        this.$store.dispatch('getMessages', request);
      }
    },
    showComposer() {
      this.$store.commit(types.SHOW_COMPOSER);
    },
  },
  props: ['content'],
  computed: {
    ...mapGetters([
      'currentSegmentGroup', 'currentSegment', 'visualisationPoints', 'isRegistered', 'messages', 'subtitles',
    ]),
    conversationContainerStyles() {
      return {
        height: `${this.segments.length * 158.0}px`,
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
  min-height 500px
  overflow hidden
  padding 0

  .activity-visualisation
    position absolute
    top 158px
    left 0
    z-index 0
    svg
      polygon
        fill $color-purple
        opacity 0.2


  .subtitle-container, .messages-container
    float left
    min-height (158.0 * 1.0)px
    position relative
    width 50%

    .time-segment
      border-color transparent
      height (158.0 * 1.0)px
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
