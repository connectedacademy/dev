<template lang="pug">

  .time-segment(ref="timeSegment" :data-top="`${158.0 * index}`" :class="segmentClasses" :style="[{ top: `${158.0 * index}px`, height: segmentOpened ? 'auto' : segmentPeekHeight }, segmentStyle]")
    
    .message-count(v-if="!isEditing && message && message.total > 1") {{ message.total }}
    .subscribed-status(v-if="!isEditing && showSubscribedStatus && subscribedTo && ((index >= subscribedTo.start) && (index <= subscribedTo.end))")

    .primary-wrapper(@click="peek")

      .admin-actions#media-actions(v-if="editingMode === 'media' && isEditing" @click="showEditModal(index)")
        icon(icon="plus")

      .transcript-wrapper(@click="openSegment()")
        transcript(:transcript="transcript" :segmentGroup="message.segmentGroup" :isCurrent="isCurrent")

      .message-wrapper(:class="{ 'editing-prompt': isEditing && editingMode === 'prompts' }")
        transition(v-if="prompt || editingMode === 'prompts'" name="fade" mode="out-in")
          prompt(:prompt="prompt" :segmentGroup="message.segmentGroup" :isCurrent="isCurrent")

        transition(v-else-if="!isEditing" appear name="fade" mode="out-in")
          mock-message(v-if="isLoading" :loading="message.loading")
          message(v-if="!isLoading" :user="user" :message="message" :truncate="true" :segment-opened="segmentOpened")

      .clearfix

    .segment-expansion-bar(@click="openSegment()" v-if="segmentPeeking")
      | Show discussion

    .meta-container(v-if="segmentOpened" :class="{ active: segmentOpened }" :style="{ bottom: `${quickNoteHeight}px` }")
      .status-indicator(v-if="loadingMessages") Fetching discussion...
      .status-indicator(v-if="!loadingMessages && (activeSegmentMessages.length === 0)" @click="loadSegmentMessages") Nothing here yet.

      .message-wrapper.animated.fadeIn(v-for="segmentMessage in activeSegmentMessages")
        message(:user="user" :message="segmentMessage")

    .quick-note(v-if="segmentPeeking || segmentOpened" :class="{ replying: replyingTo }" :style="{ top: segmentOpened ? 'auto' : quickNoteTop }")
      message-composer(:contentSlug="$route.params.contentSlug" :classSlug="$route.params.classSlug" :currentSegmentGroup="index" :quick-note-height.sync="quickNoteHeight")
    .clearfix

</template>

<script>
  import _orderBy from 'lodash/orderBy'
  import _get from 'lodash/get'

  import { mapGetters } from 'vuex'
  import API from '@/api'
  
  import MessageComposer from '@/components/MessageComposer'
  import Prompt from '@/components/live/Prompt'
  import Transcript from '@/components/live/Transcript'
  import Message from '@/components/live/Message'
  import MockMessage from '@/components/live/MockMessage'
  
  export default {
    name: 'time-segment',
    props: ['index', 'message', 'prompt', 'transcript', 'isCurrent'],
    components: {
      MessageComposer,
      Message,
      MockMessage,
      Prompt,
      Transcript
    },
    sockets: {
      message: function (val) {
        if (this.segmentPeeking && val.segment === this.message.segment) {
          this.loadSegmentMessages()
        }
      }
    },
    watch: {
      'activeSegment': {
        handler: function(nV, oV) {
          if (oV === this.message.segmentGroup) {
            this.closeSegment()
          }
        },
        deep: false,
      },
      'peekSegment': {
        handler: function(nV, oV) {
          if (nV === this.message.segmentGroup) {
  
            this.segmentPeeking = (this.segmentPeeking) ? this.segmentPeeking : true
  
          } else if (oV === this.message.segmentGroup) {
  
            this.segmentStyle = {
              transition: 'all .3s ease',
              position: 'absolute',
              height: '157px',
              'z-index': 56,
            }
  
            setTimeout(() => {
              this.unpeek()
            }, 50)
          }
        },
        deep: false,
      },
    },
    data() {
      return {
        showSubscribedStatus: false,
        segmentOpened: false,
        segmentPeeking: false,
        loadingMessages: false,
        segmentStyle: {},
        calculatedOffset: 0,
        calculatedOffsetBottom: 0,
        quickNoteHeight: 50,
        editingPrompt: false
      }
    },
    computed: {
      ...mapGetters([
        'activeSegment',
        'peekSegment',
        'activeSegmentMessages',
        'modalVisible',
        'replyingTo',
        'subscribedTo',
        'user',
        'isEditing',
        'editingMode'
      ]),
      quickNoteTop () {
        return `${158 + 32}px`
      },
      segmentPeekHeight () {
        return `${158 + 32 + this.quickNoteHeight}px`
      },
      segmentClasses () {
        return {
          peek: this.segmentPeeking,
          opened: this.segmentOpened,
          under: this.modalVisible,
          current: this.isCurrent
        }
      },
      isLoading () {
        return this.message.loading
      }
    },
    methods: {
      savePrompt (index) {
        
      },
      showEditModal (index) {
        // alert(index)
        this.$store.dispatch('showMediaUploadModal', { segment: index })
        this.$store.commit('EDITING_SEGMENT', index)
      },
      peek () {
        // Cancel peek if another segment is open
        if (typeof this.peekSegment !== 'undefined') return
        
        // Cancel peek if editing
        if (this.isEditing) return

        // Update url
        this.$router.replace({ name: 'live', params: { segmentId: this.message.segmentGroup } })

        if (!this.segmentOpened) {
  
          this.segmentStyle = {
            transition: 'height .3s ease'
          }
  
          this.$store.commit('PAUSE_MEDIA')
          this.$store.commit('SET_PEEK_SEGMENT', this.message.segmentGroup)
          this.$store.commit('EXPAND_CONVERSATION')
        }
      },
      unpeek () {
  
        this.segmentStyle = {
          position: 'absolute',
          height: '157px',
          'z-index': 56,
        }
  
        setTimeout(() => {
  
          this.segmentStyle = {}
          this.segmentOpened = this.segmentPeeking = false
          this.$store.commit('SET_PEEK_SEGMENT', undefined)
          this.$store.commit('SET_REPLYING_TO', undefined)

          this.$router.replace({ name: 'live' })

        }, 300) // Timeout equal to time for overlay to fade
      },
      openSegment () {

        // Cancel open if another segment is open
        if (typeof this.activeSegment !== 'undefined') return
        if (!this.segmentPeeking) return
  
        if (this.segmentOpened) return
  
        // Remove segment messages
        this.$store.commit('SET_SEGMENT_MESSAGES', [])
  
        this.loadingMessages = true
  
        this.$store.commit('SET_ACTIVE_SEGMENT', this.message.segmentGroup)
  
        const peekElement = document.getElementsByClassName('peek')[0].getBoundingClientRect()
        this.calculatedOffset = peekElement.top
        this.calculatedOffsetBottom = window.innerHeight - peekElement.bottom
  
        this.segmentStyle = {
          top: `${this.calculatedOffset}px`,
          bottom: `${this.calculatedOffsetBottom}px`,
          position: 'fixed',
        }
  
        setTimeout(() => {
          // DOM updated
          this.segmentOpened = true
          this.segmentStyle = {
            transition: 'all .3s ease',
            top: '60px',
            bottom: '10px',
            position: 'fixed',
          }
  
          setTimeout(() => {
            this.loadSegmentMessages()
          }, 300)
  
        }, 50)
      },
      closeSegment () {
  
        if (this.opened) return
  
        // Remove segment messages
        this.$store.commit('SET_SEGMENT_MESSAGES', [])
  
        this.segmentStyle = {
          transition: 'all .3s ease',
          top: `${this.calculatedOffset}px`,
          bottom: `${this.calculatedOffsetBottom + 90}px`,
          position: 'fixed',
        }
  
        setTimeout(() => {
          this.unpeek()
        }, 300)
      },
      loadSegmentMessages () {
  
        this.$log.info('Loading segment messages')
  
        this.loadingMessages = true
        
        const theRequest = {
          theClass: this.$route.params.classSlug,
          theContent: this.$route.params.contentSlug,
          startSegment: this.message.segmentGroup,
          endSegment: this.message.segmentGroup
        }
  
        API.message.getMessages(
          theRequest,
          response => {
            this.$store.commit('SET_SEGMENT_MESSAGES', response)
            this.loadingMessages = false
          },
          response => {
            alert('There was an error')
            this.$store.commit('SET_SEGMENT_MESSAGES', [])
            this.loadingMessages = false
          },
        )
      },
    },
  }
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.time-segment
  background-color white
  height $segment-height
  min-height $segment-height
  overflow hidden
  position absolute
  left 50%
  margin-left -390px
  z-index 0
  width $col-width

  .associated-media
    animate()
    background-color alpha(white, 0.5)
    height 158px
    width 50px
    position absolute
    left 0
    top 0
    border-top-left-radius 10px
    border-bottom-left-radius 10px
    opacity 0
    z-index -1
  &:hover
    .associated-media
      opacity 1
      left -30px

  .message-count
    transition(right 0.2s ease)
    box-sizing()
    radius(50%)
    background-color $color-pink
    color white
    font-size 0.8em
    font-weight bold
    line-height 20px
    padding 0
    position absolute
    top 10px
    right 5px
    min-width 20px
    pointer-events none
    text-align center
    z-index 51
    @media(max-width: 800px)
      right 0
  
  &.peek
    .message-count
      @media(max-width: 800px)
        right 10px

  .subscribed-status
    radius(4px)
    background-color $color-border
    right auto
    left 10px
    top 10px
    position absolute
    height 8px
    width 8px
    z-index 51

  @media(max-width: 800px)
    left 10px
    margin-left 0
    width calc(100% - 20px)

  &.peek
    .transcript-wrapper:hover
      cursor pointer
  &.opened
    .transcript-wrapper:hover
      cursor default !important
  &.peek, &.open
    .primary-wrapper:hover
      cursor default !important

  .primary-wrapper
    background-color white
    border-bottom $color-border 1px solid
    height 157px
    min-height 157px
    position relative
    z-index 2
    &:hover
      cursor pointer

    .admin-actions
      radius(50%)
      background-color $color-pink
      display none
      height 40px
      width 40px
      position absolute
      top 10px
      right 10px
      z-index 999
      svg
        color white
        height 20px
        margin 10px
        width 20px
    &:hover
      cursor pointer
      .admin-actions
        display block

    .message-wrapper
      position absolute
      top 50%

    .transcript-wrapper
      animate()
      position absolute
      top 50%

  @media(min-width: 800px)
    .primary-wrapper:before
      pinned()
      transition(left .2s linear)
      background-color $color-pink
      content ''
      left -3px
      position absolute
      right auto
      z-index 2
      pointer-events none
      width 3px

  &.current .primary-wrapper

    &:before
      left 0

  &.peek, &.active
    radius($corner-radius)
    z-index 56
    border none

    &.under
      z-index 55 !important

  &.peek
    height 240px

  &.opened
    height auto
    .segment-expansion-bar
      opacity 0
      pointer-events none

    &.under
      z-index 55 !important

  .meta-container
    box-sizing()
    background-color $color-lightest-grey
    background-color white
    opacity 0
    padding 10px 0
    position absolute
    top 157px
    bottom 50px
    right 0
    left 0
    overflow auto
    .message-wrapper
      left 50%
      transform translate(0, 0) !important
      position relative
      width 50%
      @media(max-width: 600px)
        display block !important
        left 0
        width 100%
      .tweet-actions
        background-color inherit
    &.active
      opacity 1
    

  .status-indicator
    background-color transparent
    color $color-text-light-grey
    padding 40px
    text-align center

.quick-note
  box-sizing()
  border-top $color-border 1px solid
  position absolute
  bottom 0
  left 0
  right 0
  z-index 0
  &.replying
    z-index 2

.segment-expansion-bar
  animate()
  background-color white
  color #999
  cursor pointer
  padding 5px 20px
  position absolute
  top 158px
  left 0
  right 0
  z-index 1
  text-align center
  &:hover
    background-color $color-lightest-grey
</style>
