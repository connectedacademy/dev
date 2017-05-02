<template lang="pug">

  .conversation-container(v-if="registered" v-bind:class="{ 'message-priority': messagePriority }")

    .subtitle-container

      subtitle(v-for="subtitle in subtitles" v-bind:key="subtitle.id" v-bind:subtitle="subtitle")

    .messages-container
      .time-segment(v-for="(segment, index) in segments" v-bind:style="segmentStyle" v-bind:class="{ active: (currentSectionSegment === index) }")

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
    this.getMessages(0);
  },
  ready() {
    this.$nextTick(() => {
      this.getPosition();
    });
  },
  watch: {
    currentSectionSegment(oldVal, newVal) {
      if (oldVal !== newVal) {
        console.log(`Segment changed - ${newVal}`);

        this.getMessages(newVal);
      }
    },
  },
  methods: {
    getMessages(segment) {
      const length = 10;
      const request = {
        theClass: this.$store.getters.currentClass.slug,
        theContent: this.contentSlug,
        startSegment: `${segment}`,
        endSegment: `${segment + length}`,
      };

      if ((segment % length) === 0) {
        console.log('Requesting segments');
        this.$store.dispatch('getMessages', request);
      }
    },
  },
  props: ['contentSlug'],
  computed: {
    currentSectionSegment() {
      return this.$store.getters.currentSectionSegment;
    },
    registered() {
      return this.$store.getters.isRegistered;
    },
    segments() {
      const segments = [];
      let i = 200;
      while (i > 0) {
        segments.push(i);
        i -= 1;
      }
      return segments;
    },
    messages() {
      return this.$store.getters.messages;
    },
    subtitles() {
      return this.$store.getters.subtitles;
    },
    segmentStyle() {
      const heightVal = 158;
      return { height: `${heightVal}px` };
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
  overflow hidden
  padding 0

  .subtitle-container, .messages-container
    float left
    min-height 158px
    position relative
    width 50%

    .time-segment
      border-color transparent
      height 108px
      animate()
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
