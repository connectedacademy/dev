<template lang="pug">

  .time-segment(ref="timeSegment" v-bind:data-top="`${158.0 * index}`" v-bind:class="segmentClasses" v-bind:style="[{ top: `${158.0 * index}px`, height: segmentOpened ? 'auto' : segmentPeekHeight }, segmentStyle]")
    .associated-media
    .message-count(v-if="messageCount") {{ messageCount }}
    //- .message-count {{ (index * 5) }}
    .subscribed-status(v-if="showSubscribedStatus && subscribedTo && ((index >= subscribedTo.start) && (index <= subscribedTo.end))")

    .primary-wrapper(@click="peek")

      .avatar(v-bind:style="{ 'background-image': profile }")

      .subtitle-wrapper(@click="openSegment()")
        subtitle(v-bind:subtitle="subtitle")

      .message-wrapper

        .suggestion(v-if="isSuggestion") "{{ message.message.text }}"
        message(v-else-if="isMessage" v-bind:message="message.message" v-bind:truncate="true" v-bind:segment-opened="segmentOpened")
        mock-message(v-else-if="isMock" v-bind:loading="message.loading")

      .clearfix

    .segment-expansion-bar(@click="openSegment()" v-if="segmentPeeking")
      | Show discussion

    .meta-container(v-if="segmentOpened" v-bind:class="{ active: segmentOpened }" v-bind:style="{ bottom: `${quickNoteHeight}px` }")
      .status-indicator(v-if="loadingMessages") Fetching discussion...
      .status-indicator(v-if="!loadingMessages && (orderedMessages.length === 0)" @click="loadSegmentMessages") Nothing here yet.

      .message-wrapper.animated.fadeIn(v-for="segmentMessage in orderedMessages")
        message(v-bind:message="segmentMessage")

    .quick-note(v-if="segmentPeeking || segmentOpened" v-bind:class="{ replying: replyingTo }" v-bind:style="{ top: segmentOpened ? 'auto' : quickNoteTop }")
      message-composer(v-bind:contentSlug="contentSlug" v-bind:classSlug="classSlug" v-bind:currentSegmentGroup="index" v-bind:quick-note-height.sync="quickNoteHeight")
    .clearfix

</template>

<script>
  import _orderBy from 'lodash/orderBy';
  import _get from 'lodash/get';

  import { mapGetters } from 'vuex';
  import API from '@/api';
  
  import MessageComposer from '@/components/MessageComposer';
  import Subtitle from '@/components/live/Subtitle';
  import Message from '@/components/live/Message';
  import MockMessage from '@/components/live/MockMessage';
  
  export default {
    name: 'time-segment',
    props: ['index', 'message', 'subtitle', 'classSlug', 'contentSlug', 'isCurrent'],
    components: {
      MessageComposer,
      Message,
      MockMessage,
      Subtitle,
    },
    watch: {
      'activeSegment': {
        handler: function(nV, oV) {
          if (oV === this.message.segmentGroup) {
            this.closeSegment();
          }
        },
        deep: false,
      },
      'peekSegment': {
        handler: function(nV, oV) {
          if (nV === this.message.segmentGroup) {
  
            this.segmentPeeking = (this.segmentPeeking) ? this.segmentPeeking : true;
  
          } else if (oV === this.message.segmentGroup) {
  
            this.segmentStyle = {
              transition: 'all .3s ease',
              position: 'absolute',
              height: '157px',
              'z-index': 56,
            };
  
            setTimeout(() => {
              this.unpeek()
            }, 50);
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
      };
    },
    computed: {
      ...mapGetters([
        'activeSegment',
        'peekSegment',
        'activeSegmentMessages',
        'modalVisible',
        'replyingTo',
        'subscribedTo',
      ]),
      profile () {
        return `url('${this.$store.state.auth.user.profile}')`
      },
      quickNoteTop () {
        return `${158 + 32}px`;
      },
      segmentPeekHeight () {
        return `${158 + 32 + this.quickNoteHeight}px`;
      },
      segmentClasses () {
        return {
          peek: this.segmentPeeking,
          opened: this.segmentOpened,
          under: this.modalVisible,
          current: this.isCurrent
        }
      },
      isMessage () {
        return this.messageCount
      },
      isSuggestion () {
        return _get(this.message, ['message', 'suggestion'], false);
      },
      isMock () {
        return this.message.loading || !this.isMessage
      },
      messageCount () {
        return _get(this.message, ['info', 'total'], undefined);
      },
      orderedMessages () {
        return _orderBy(this.activeSegmentMessages, ['createdAt'], ['asc']);
      }
    },
    methods: {
      peek () {
        
        // Cancel peek if another segment is open
        if (typeof this.peekSegment !== 'undefined') return;
        
        // Update url
        this.$router.replace({ name: 'live', params: { segmentId: this.message.segmentGroup } });

        if (!this.segmentOpened) {
  
          this.segmentStyle = {
            transition: 'height .3s ease'
          };
  
          this.$store.commit('PAUSE_MEDIA');
          this.$store.commit('SET_PEEK_SEGMENT', this.message.segmentGroup);
        }
      },
      unpeek () {
  
        this.segmentStyle = {
          position: 'absolute',
          height: '157px',
          'z-index': 56,
        };
  
        setTimeout(() => {
  
          this.segmentStyle = {};
          this.segmentOpened = this.segmentPeeking = false;
          this.$store.commit('SET_PEEK_SEGMENT', undefined);
          this.$store.commit('SET_REPLYING_TO', undefined);

          this.$router.replace({ name: 'live' });

        }, 300); // Timeout equal to time for overlay to fade
      },
      openSegment () {

        // Cancel open if another segment is open
        if (typeof this.activeSegment !== 'undefined') return;
        if (!this.segmentPeeking) return
  
        if (this.segmentOpened) return;
  
        // Remove segment messages
        this.$store.commit('SET_SEGMENT_MESSAGES', []);
  
        this.loadingMessages = true;
  
        this.$store.commit('SET_ACTIVE_SEGMENT', this.message.segmentGroup)
  
        const peekElement = document.getElementsByClassName('peek')[0].getBoundingClientRect();
        this.calculatedOffset = peekElement.top;
        this.calculatedOffsetBottom = window.innerHeight - peekElement.bottom;
  
        this.segmentStyle = {
          top: `${this.calculatedOffset}px`,
          bottom: `${this.calculatedOffsetBottom}px`,
          position: 'fixed',
        };
  
        setTimeout(() => {
          // DOM updated
          this.segmentOpened = true;
          this.segmentStyle = {
            transition: 'all .3s ease',
            top: '60px',
            bottom: '10px',
            position: 'fixed',
          };
  
          setTimeout(() => {
            this.loadSegmentMessages()
          }, 300);
  
        }, 50);
      },
      closeSegment () {
  
        if (this.opened) return
  
        // Remove segment messages
        this.$store.commit('SET_SEGMENT_MESSAGES', []);
  
        this.segmentStyle = {
          transition: 'all .3s ease',
          top: `${this.calculatedOffset}px`,
          bottom: `${this.calculatedOffsetBottom + 90}px`,
          position: 'fixed',
        };
  
        setTimeout(() => {
          this.unpeek()
        }, 300)
      },
      loadSegmentMessages () {
  
        this.$log.info('Loading segment messages');
  
        this.loadingMessages = true;
  
        let theContent = (this.message.message && this.message.message.content) ? this.message.message.content : this.contentSlug;
  
        const theRequest = {
          theClass: this.classSlug,
          theContent: this.contentSlug,
          startSegment: `${this.message.segmentGroup}`,
          endSegment: `${parseInt(this.message.segmentGroup) + 4}`,
        };
  
        API.message.getMessages(
          theRequest,
          response => {
            this.$store.commit('SET_SEGMENT_MESSAGES', response.data);
            this.loadingMessages = false;
          },
          response => {
            alert('There was an error');
            this.$store.commit('SET_SEGMENT_MESSAGES', []);
            this.loadingMessages = false;
          },
        );
      },
    },
  };
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
    .subtitle-wrapper:hover
      cursor pointer
  &.opened
    .subtitle-wrapper:hover
      cursor default !important
  &.peek, &.open
    .primary-wrapper:hover
      cursor default !important

  .primary-wrapper
    background-color white
    border-bottom $color-border 1px solid
    height 156px
    min-height 156px
    position relative
    z-index 2
    &:hover
      cursor pointer

    .suggestion
      color $color-text-dark-grey
      font-size 1.2em
      font-weight bold
      padding 20px
      text-align center

    .message-wrapper
      animate()
      position absolute
      top 50%

    .subtitle-wrapper
      animate()
      position absolute
      top 50%

  .primary-wrapper .avatar
    radius(50%)
    background-image()
    display none
    position absolute
    bottom 10px
    right 10px
    height 20px
    width 20px

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
    .avatar
      display block

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