<template lang="pug">

  .conversation-container(ref="conversationContainer" v-if="registered" v-bind:class="{ 'message-priority': messagePriority }" v-bind:style="conversationContainerStyles")

    .subtitle-container

      .activity-visualisation
        svg(width="200" v-bind:height="(segments.length * 158.0)")
          g
            polygon(v-bind:points="points")

      subtitle(v-for="subtitle in subtitles" v-bind:key="subtitle.id" v-bind:subtitle="subtitle")

    .messages-container

      .time-segment(v-for="(segment, index) in segments" v-bind:class="{ active: (currentSectionSegment === index) }")

        .message-count(v-if="messages && messages[index]")
          | {{ messages[index].length }}

        span(v-if="messages && messages[index]")
          message(v-for="message in messages[index]" v-bind:key="message.id" v-bind:message="message")

    .clearfix

</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

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
    currentSectionSegment(oldVal, newVal) {
      if (oldVal !== newVal) {
        this.getMessages((newVal * 5));
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
      const length = 100
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
  },
  props: ['content'],
  computed: {
    points() {
      return this.$store.getters.visualisationPoints;
    },
    conversationContainerStyles() {
      return {
        height: `${this.segments.length * 158.0}px`,
      };
    },
    currentSectionSegment() {
      return this.$store.getters.currentSectionSegment;
    },
    registered() {
      return this.$store.getters.isRegistered;
    },
    segments() {
      // Calculate number of segments
      return _.map(_.range(_.ceil(this.content.duration * 0.2)), function () { return undefined; });;
    },
    messages() {
      return this.$store.getters.messages;
    },
    subtitles() {
      return this.$store.getters.subtitles;
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
        background-color red
        color white
        padding 10px
        position absolute
        top 0
        right 0
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
    border-left $color-light-grey 1px solid
    border-color transparent
    width calc(50% - 1px)
    .time-segment
      overflow hidden
      &.active
        background-color #e1e1e1

  @media(max-width: 600px)
    &.message-priority
      .subtitle-container
        width 50px
      .messages-container
        width calc(100% - 1px - 50px)

</style>
