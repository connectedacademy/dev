<template lang="pug">

  .time-segment(ref="timeSegment" v-bind:data-top="`${158.0 * index}`" v-bind:class="segmentClasses" v-bind:style="[{ top: `${158.0 * index}px`, height: segmentOpened ? 'auto' : segmentPeekHeight }, segmentStyle]")

    .message-count(v-if="messageCount") {{ messageCount }}
    .subscribed-status(v-if="subscribedTo && (((index * 5) >= subscribedTo.start) && ((index * 5) <= subscribedTo.end))")

    .primary-wrapper(@click="peek")

      .subtitle-wrapper
        subtitle(v-bind:subtitle="subtitle")

      .message-wrapper

        .suggestion(v-if="isSuggestion") "{{ message.message.text }}"
        message(v-else-if="isMessage" v-bind:message="message.message" v-bind:truncate="true")
        mock-message(v-else-if="isMock" v-bind:loading="message.loading")

      .clearfix

    .segment-expansion-bar(@click="openSegment()" v-if="segmentPeeking")
      | Show all notes

    .meta-container(v-if="segmentOpened" v-bind:class="{ active: segmentOpened }" v-bind:style="{ bottom: `${quickNoteHeight}px` }")
      .status-indicator(v-if="loadingMessages") Looking for notes...
      .status-indicator(v-if="!loadingMessages && (orderedMessages.length === 0)" @click="loadSegmentMessages") Be the first to make a note.

      .message-wrapper.animated.fadeIn(v-for="segmentMessage in orderedMessages")
        message(v-bind:message="segmentMessage")

    .quick-note(v-if="segmentPeeking || segmentOpened" v-bind:class="{ replying: replyingTo }" v-bind:style="{ top: segmentOpened ? 'auto' : quickNoteTop }")
      message-composer(v-bind:contentSlug="contentSlug" v-bind:classSlug="classSlug" v-bind:currentSegment="index" v-bind:quick-note-height.sync="quickNoteHeight")
    .clearfix

</template>

<script>
  import _orderBy from 'lodash/orderBy';
  import _get from 'lodash/get';

  import { mapGetters } from 'vuex';
  import API from '@/api';
  
  import MessageComposer from '@/components/MessageComposer';
  import Subtitle from '@/components/conversation/Subtitle';
  import Message from '@/components/conversation/Message';
  import MockMessage from '@/components/conversation/MockMessage';
  
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
      // '$route.query.segment': {
      //   handler: function(nV, oV) {
      //   console.log('$route.query.segment');
      //     if (nV !== oV) {
      //       if ((oV) && (this.message.segmentGroup === oV)) {
      //         if (this.activeSegment) {
      //           this.$store.commit('SET_ACTIVE_SEGMENT', undefined);
      //         } else {
      //           this.unpeek()
      //         }
      //       }
      //     }
      //   },
      //   deep: true,
      // },
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
        segmentExpanded: false,
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
      quickNoteTop() {
        return `${158 + 32}px`;
      },
      segmentPeekHeight() {
        return `${158 + 32 + this.quickNoteHeight}px`;
      },
      segmentClasses() {
        return {
          peek: this.segmentPeeking,
          opened: this.segmentOpened,
          under: this.modalVisible,
          current: this.isCurrent
        }
      },
      isMessage() {
        return this.messageCount
      },
      isSuggestion() {
        return _get(this.message, ['message', 'suggestion'], false);
      },
      isMock() {
        return this.message.loading || !this.isMessage
      },
      messageCount() {
        return _get(this.message, ['info', 'total'], undefined);
      },
      orderedMessages() {
        return _orderBy(this.activeSegmentMessages, ['createdAt'], ['asc']);
      }
    },
    methods: {
      peek() {
        
        // Cancel peek if another segment is open
        if (typeof this.peekSegment !== 'undefined') return;
        
        // Update url
        const segmentId = (this.message.segmentGroup / 0.2)
        this.$router.replace({ name: 'class', params: { classSlug: this.classSlug, contentSlug: this.contentSlug, segmentId: segmentId } });

        if (!this.segmentOpened) {
  
          this.segmentStyle = {
            transition: 'height .3s ease'
          };
  
          this.$store.commit('PAUSE_MEDIA');
          this.$store.commit('SET_PEEK_SEGMENT', this.message.segmentGroup);
        }
      },
      unpeek() {
  
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

          this.$router.replace({ name: 'class', params: { classSlug: this.classSlug } });

        }, 300); // Timeout equal to time for overlay to fade
      },
      openSegment() {

        // Cancel open if another segment is open
        if (typeof this.activeSegment !== 'undefined') return;
  
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
      closeSegment() {
  
        if (this.opened) {
          return
        }
  
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
        }, 300);
      },
      loadSegmentMessages() {
  
        this.$log.info('Loading segment messages');
  
        this.loadingMessages = true;
  
        let theContent = (this.message.message && this.message.message.content) ? this.message.message.content : this.contentSlug;
  
        const theRequest = {
          theClass: this.classSlug,
          theContent: this.contentSlug,
          startSegment: `${parseInt(this.message.segmentGroup) / 0.2}`,
          endSegment: `${parseInt(this.message.segmentGroup) / 0.2 + 4}`,
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
  width 780px

  .message-count
    box-sizing()
    border-top-left-radius 4px
    border-bottom-left-radius 4px
    background-color $color-primary
    color white
    font-size 0.8em
    line-height 20px
    padding 0 8px
    position absolute
    top 10px
    right 0
    min-width 20px
    text-align center
    z-index 51
    @media(max-width: 800px)
      radius(4px)
    
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

  .primary-wrapper
    
    background-color white

    border-bottom $color-border 1px solid
    height 156px
    min-height 156px
    position relative
    z-index 2

    .segment-label--group
      radius(4px)
      animate()
      background $color-lightest-grey
      font-size 0.8em
      opacity 0.05
      padding 6px 12px
      position absolute
      top 10px
      left 10px
      z-index 2

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

    &:hover
      cursor pointer
      .segment-label--group
        opacity 1

  &.current
    .primary-wrapper
      &:after
        radius(50%)
        background-color $color-primary
        content ''
        position absolute
        top 10px
        left 10px
        height 10px
        width 10px

  &.peek, &.active
    radius(4px)
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
    opacity 0
    padding 10px 0
    position absolute
    top 157px
    bottom 50px
    right 0
    left 0
    overflow auto
    .message-wrapper
      transform translate(0, 0) !important
      position relative
      width 100%
      @media(max-width: 600px)
        display block !important
      .tweet-actions
        background-color inherit
    &.active
      opacity 1
    

  .status-indicator
    background-color transparent
    color $color-text-grey
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
