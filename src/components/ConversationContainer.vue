<template lang="pug">

  .conversation-container(ref="conversationContainer")

    #view-toggle(v-if="$route.name === 'live' && !activeSegment" @click="messagePriority = !messagePriority" v-bind:class="{ 'message-priority': messagePriority, peeking: peekSegment}")
      onboarding-prompt(identifier="view-toggle" prompt="transcript/tweets" top="50" left="-70" position="top-right" z-index="1")
      i.fas.fa-quote-left
      i.fab.fa-twitter(v-if="course.engine === 'twitter'" title="Messages are published on Twitter")
      i.fas.fa-comment(v-if="course.engine === 'local'" title="Messages are stored on Connected Academy")

    .inner-wrapper(ref="innerwrapper" v-bind:style="{ height: containerHeight }" v-bind:class="{ 'message-priority': messagePriority }")
      time-segment(v-for="(message, index) in conversationMessages"
        v-if="index > startSegment && index < endSegment"
        v-bind:key="index"
        v-bind:index="index"
        v-bind:message="message"
        v-bind:transcript="transcript[index]"
        v-bind:isCurrent="isCurrent(index)")

</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

// Mixins
import Messages from '@/mixins/Messages'
import Transcript from '@/mixins/Transcript'

import TimeSegment from '@/components/live/TimeSegment'

export default {
  name: 'conversation-container',
  mixins: [
    Messages,
    Transcript,
  ],
  components: {
    TimeSegment,
  },
  props: ['content', 'collapsed'],
  mounted() {
    this.loadTranscript(this.content)
    this.loadSegmentSummary(0, true)

    EventBus.$on('scrollStatus', (scrollStatus) => {
      this.scrollStatus = scrollStatus
    })

    window.addEventListener('keydown', (event) => {
      // ESC
      if (event.keyCode === 27) {
        this.$store.commit('SET_ACTIVE_SEGMENT', undefined)
        this.$store.commit('SET_PEEK_SEGMENT', undefined)
      }
    })
  },
  data() {
    return {
      messagePriority: false,
      scrollStatus: undefined,
    }
  },
  computed: {
    ...mapGetters(['peekSegment', 'activeSegment', 'course', 'mediaPlaying']),
    containerHeight() {
      return `${((this.content.duration * 0.2) + 3) * this.$app.segmentHeight - 160}px`
    },
    segmentCount() {
      return this.content.duration * 0.2
    }
  },
  watch: {
    activeSegment(nV) {
      setTimeout(() => {
        this.messagePriority = (nV) ? false : this.messagePriority
      }, 300)
    },
    peekSegment(nV) {
      if (typeof nV !== 'undefined') {
        this.loadSegmentSummary(nV, true)
      }
    },
    scrollStatus(nV, oV) {
      if ((typeof nV === 'undefined') || (typeof oV === 'undefined') || (nV.currentSegmentGroup === oV.currentSegmentGroup)) return

      this.$log.info(`Fetching segment: ${nV.currentSegmentGroup}`)
      this.loadSegmentSummary(nV.currentSegmentGroup, true)
    },
  },
  methods: {
    isCurrent(index) {
      return this.scrollStatus && (this.scrollStatus.currentSegmentGroup === parseInt(index))
    },
  },
}
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
    background-position center 0
    overflow hidden
    
    .transcript-wrapper, .message-wrapper
      transform translate(0%, -50%)
      width 50%
      &.message-wrapper
        transform translate(100%, -50%)

    @media(max-width: 600px)
      .transcript-wrapper, .message-wrapper
        width 100%
        &.transcript-wrapper
          display block
        &.message-wrapper
          display none
      &.message-priority
        .transcript-wrapper, .message-wrapper
          width 100%
          &.transcript-wrapper
            display none
          &.message-wrapper
            display block
            transform translate(0%, -50%)

#view-toggle
  animate()
  radius(22px)
  background-color alpha(white, 0.1)
  color white
  display none
  height 44px
  width 100px
  padding 0 10px
  position fixed
  top 8px
  left 50%
  margin-left -60px
  z-index 55
  &:hover
    cursor pointer
  @media(max-width: 600px)
    display block
  > svg
    animate()
    display inline-block
    height 44px
    padding 0 15px
    width 20px
  > svg:first-child
    opacity 1.0
    transform scale(1)
  > svg:last-child
    opacity 0.5
    transform scale(0.8)
  &:hover
    > svg
      transform scale(1) !important
  &.message-priority
    > svg:first-child
      opacity 0.5
      transform scale(0.8)
    > svg:last-child
      opacity 1.0
      transform scale(1)
      

</style>
