<template lang="pug">

  .conversation-container(ref="conversationContainer")

    #view-toggle(v-if="currentSection" @click="messagePriority = !messagePriority" v-bind:class="{ 'message-priority': messagePriority}")
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
    this.loadSegmentSummary(0, true);
    this.loadSubtitles(this.content);
    this.loadMedia(this.content);
    this.loadVisualisation(this.content);
    
    // Fill with blank messages
    // const segmentCount = this.content.duration * 0.2;
    // for (var index = 0; index < segmentCount; index++) {
    //   if (this.messages[index]) continue;
    //   this.messages[index] = {
    //     loading: true,
    //     segmentGroup: index
    //   }
    // }
  },
  data() {
    return {
      messagePriority: true,
    };
  },
  computed: {
    ...mapGetters([
      'currentSection', 'currentSegmentGroup', 'peekSegment', 'course',
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
        const force = (Math.abs(nV - oV) > 5);
        this.loadSegmentSummary(nV, force);
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
      display none

      // z-index 50
      // left -400px
      // right auto
      // svg
      //   path
      //     fill alpha($color-primary, 0.3)


  .inner-wrapper
    background-color white
    background url('../assets/images/line.png')
    background-repeat repeat
    background-size 1px 158px
    
    overflow hidden
    .subtitle-wrapper, .message-wrapper
      width 50%
      &.subtitle-wrapper
        transform translate(0%, -50%)
      &.message-wrapper
        transform translate(100%, -50%)

    @media(max-width: 600px)
      .subtitle-wrapper, .message-wrapper
        width 100%
        &.subtitle-wrapper
          display block
          transform translate(0%, -50%)
        &.message-wrapper
          display none
      &.message-priority
        .subtitle-wrapper, .message-wrapper
          width 100%
          &.subtitle-wrapper
            display none
          &.message-wrapper
            display block
            transform translate(0%, -50%)

#view-toggle
  animate()
  radius(4px)
  background-color $color-primary
  color white
  display none
  height 100px
  width 60px
  position fixed
  top 80px
  right -10px
  z-index 56
  @media(max-width: 600px)
    display block
  .fa-icon
    display block
    height 50px
    padding 0 15px
    width 20px
    &:first-child
      opacity 0.5
    &:last-child
      border-top alpha(black, 0.1) 1px solid
      opacity 1.0
  &.message-priority
    .fa-icon:first-child
      opacity 1.0
    .fa-icon:last-child
      opacity 0.5

</style>
