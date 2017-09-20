<template lang="pug">

  .conversation-container(ref="conversationContainer")

    #view-toggle(v-show="currentSegment" @click="messagePriority = !messagePriority" v-bind:class="{ 'message-priority': messagePriority}")
      icon(name="twitter")
      icon(name="quote-right")

    #activity-visualisation(v-if="!peekSegment")
      svg(width="400" v-bind:height="containerHeight")
        g
          path(v-bind:d="points" transform="translate(400,0)")

    .inner-wrapper(v-bind:style="{ height: containerHeight }" v-bind:class="{ 'message-priority': messagePriority }")
      time-segment(v-for="(message, index) in chunkedMessages" v-bind:key="index" v-bind:index="index" v-bind:message="messages[index]" v-bind:subtitle="subtitles[index]")

</template>

<script>
import { mapGetters } from 'vuex';

// Mixins
import Messages from '@/mixins/Messages';
import Media from '@/mixins/Media';
import Subtitles from '@/mixins/Subtitles';
import Visualisation from '@/mixins/Visualisation';

import TimeSegment from '@/components/conversation/TimeSegment';

import 'vue-awesome/icons/twitter';
import 'vue-awesome/icons/quote-right';

export default {
  name: 'conversation-container',
  mixins: [
    Messages,
    Media,
    Subtitles,
    Visualisation,
  ],
  components: {
    TimeSegment,
  },
  props: ['content'],
  mounted() {
    this.loadMedia(this.content);
    this.loadVisualisation(this.content);
    this.loadSubtitles(this.content);
    setTimeout(() => {
      this.$log.info(`Getting messages for segment ${0}`);
      this.loadSegmentSummary(0);
    }, 100);
  },
  data() {
    return {
      messagePriority: true,
    };
  },
  computed: {
    ...mapGetters([
      'currentClass', 'currentSegmentGroup', 'currentSegment', 'peekSegment', 'course',
    ]),
    containerHeight() {
      return `${(this.content.duration * 0.2) * 158.0 + 124}px`;
    },
  },
  watch: {
    currentSegmentGroup(nV, oV) {
      if (nV === undefined) { return; }
      if (oV !== nV) {
        this.$log.info(`Getting messages for segment ${nV}`);

        this.loadSegmentSummary(nV);
      }
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
      path
        fill alpha($color-primary, 1)

    @media(max-width: 600px)
      z-index 50
      left -400px
      right auto
      svg
        path
          fill alpha($color-primary, 0.3)


  .inner-wrapper
    overflow hidden
    .subtitle-wrapper, .message-wrapper
      animate()
      width 50%
      &.subtitle-wrapper
        transform translate(0%, -50%)
      &.message-wrapper
        transform translate(100%, -50%)

    @media(max-width: 600px)
      .subtitle-wrapper, .message-wrapper
        width 100%
        &.subtitle-wrapper
          transform translate(0%, -50%)
        &.message-wrapper
          transform translate(100%, -50%)
      &.message-priority
        .subtitle-wrapper, .message-wrapper
          width 100%
          &.subtitle-wrapper
            transform translate(-100%, -50%)            
          &.message-wrapper
            transform translate(0%, -50%)

#view-toggle
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
