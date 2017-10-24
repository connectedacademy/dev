<template lang="pug">

  .conversation-container(ref="conversationContainer")

    #view-toggle(v-if="currentSection && !activeSegment" @click="messagePriority = !messagePriority" v-bind:class="{ 'message-priority': messagePriority, peeking: peekSegment}")
      onboarding-prompt(identifier="view-toggle" prompt="subtitles/tweets" top="110" left="-140" position="top-right" z-index="1")
      icon(name="twitter")
      icon(name="quote-right")

    .inner-wrapper(ref="innerwrapper" v-bind:style="{ height: containerHeight }" v-bind:class="{ 'message-priority': messagePriority }")
      time-segment(v-for="(message, index) in conversationMessages"
        v-bind:key="index"
        v-bind:index="index"
        v-bind:message="message"
        v-bind:subtitle="subtitles[index]"
        v-bind:contentSlug="content.slug"
        v-bind:classSlug="currentClass.slug"
        v-bind:isCurrent="false")
        //- isCurrent(index)

</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { EventBus } from '@/event-bus.js';

// Mixins
import Messages from '@/mixins/Messages';
import Media from '@/mixins/Media';
import Subtitles from '@/mixins/Subtitles';

import TimeSegment from '@/components/conversation/TimeSegment';

import 'vue-awesome/icons/twitter';
import 'vue-awesome/icons/quote-right';

export default {
  name: 'conversation-container',
  mixins: [
    Messages,
    Media,
    Subtitles,
  ],
  components: {
    TimeSegment,
  },
  props: ['content', 'collapsed'],
  mounted() {
    this.loadSubtitles(this.content);
    this.loadMedia(this.content);
    this.loadSegmentSummary(0, true);

    // Fill with blank messages
    const start = 0;
    const segmentCount = this.content.duration * 0.2;
    // const segmentCount = 10;
    for (var index = start; index < segmentCount; index++) {
      if (this.conversationMessages[index]) continue;
      Vue.set(this.conversationMessages, index, { loading: true, segmentGroup: index });
    }

    EventBus.$on('scrollStatus', (scrollStatus) => {
      this.scrollStatus = scrollStatus;
    });

    window.addEventListener('keydown', (event) => {
      // SPACE
      if (event.keyCode === 32) { 
        if (typeof this.peekSegment !== 'undefined') return;
        if (typeof this.currentSection === 'undefined') return;
        event.preventDefault();
        this.$store.commit(this.mediaPlaying ? 'PAUSE_MEDIA' : 'PLAY_MEDIA');
      }
      // ESC
      if (event.keyCode === 27) {
        this.$store.commit('SET_ACTIVE_SEGMENT', undefined);
        this.$store.commit('SET_PEEK_SEGMENT', undefined);
      }
    });
  },
  data() {
    return {
      messagePriority: false,
      scrollStatus: undefined,
    };
  },
  computed: {
    ...mapGetters([
      'currentSection', 'peekSegment', 'activeSegment', 'course', 'mediaPlaying',
    ]),
    containerHeight() {
      return `${((this.content.duration * 0.2) + 1) * this.$app.segmentHeight}px`;
    },
  },
  watch: {
    activeSegment(nV) {
      setTimeout(() => {
        this.messagePriority = (nV) ? false : this.messagePriority;
      }, 300);
    },
    scrollStatus(nV, oV) {
      if (typeof nV !== 'undefined') {
        if (typeof oV === 'undefined') {
          this.loadSegmentSummary(nV.currentSegmentGroup, true);
        }
        else if (oV.currentSegmentGroup !== nV.currentSegmentGroup) {
          this.$log.info(`Getting messages for segment ${nV.currentSegmentGroup}`);
          this.loadSegmentSummary(nV.currentSegmentGroup, true);
        }
      }
    },
  },
  methods: {
    isCurrent(index) {
      return this.scrollStatus && (this.scrollStatus.currentSegmentGroup === parseInt(index))
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
    overflow hidden

  h5
    reset()
    color #444
    height 60px
    line-height 60px
    width 100%

  .inner-wrapper
    background-color white
    background url('../assets/images/line.png')
    background-repeat repeat
    background-position center -1px
    overflow hidden
    
    .subtitle-wrapper, .message-wrapper
      transform translate(0%, -50%)
      width 50%
      &.message-wrapper
        transform translate(100%, -50%)

    @media(max-width: 600px)
      .subtitle-wrapper, .message-wrapper
        width 100%
        &.subtitle-wrapper
          display block
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
  z-index 55
  &.peeking
    z-index 57  
  @media(max-width: 600px)
    display block
  > .fa-icon
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
    > .fa-icon:first-child
      opacity 1.0
    > .fa-icon:last-child
      opacity 0.5

</style>
