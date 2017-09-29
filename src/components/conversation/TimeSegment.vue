<template lang="pug">

  .time-segment(ref="timeSegment" v-bind:class="{ peek: segmentPeeking, opened: segmentOpened, 'below-modal': belowModal }" v-bind:style="[{ top: `${158.0 * index}px` }, segmentStyle]")

    .primary-wrapper(@click="peek()")

      //- .segment-label--group(v-once v-if="this.$store.state.debug") {{ `${message.segmentGroup}/${message.segmentGroup / 0.2}` }}

      .subtitle-wrapper
        subtitle(v-bind:subtitle="subtitle")

      .message-wrapper(v-bind:class="{ loading: message.loading }")

        .suggestion(v-once v-if="message.message && message.message.suggestion")
          h3 "{{ message.message.text }}"

        mock-message(v-once v-else-if="message.loading || (message.info && (message.info.total === 0 && !message.message.suggestion))")
        
        message(v-else-if="message.info && (message.info.total > 0) && !message.message.suggestion" v-bind:message="message.message")

      .clearfix

    .segment-expansion-bar(@click="openSegment()" v-if="segmentPeeking")
      span(v-if="message.info && message.info.total && (message.info.total > 1)") {{ `Read ${message.info.total} other notes` }}
      span(v-else) Be the first to make a note.

    .meta-container(v-if="segmentPeeking || segmentOpened" v-bind:class="{ active: segmentOpened }")
      .status-indicator(v-if="loadingMessages") Looking for notes...
      .status-indicator(v-if="!loadingMessages && (orderedMessages.length === 0)" @click="loadSegmentMessages") Be the first to make a note.

      .message-wrapper.animated.fadeIn(v-for="segmentMessage in orderedMessages" v-bind:class="{ featured: (segmentMessage.id === message.message.id) }")
        message(v-bind:message="segmentMessage")

    .quick-note(v-if="segmentPeeking || segmentOpened" v-bind:class="{ replying: replyingTo }")
      message-composer(v-bind:contentSlug="contentSlug" v-bind:classSlug="classSlug" v-bind:currentSegment="index")
    .clearfix

</template>

<script>
  import orderBy from 'lodash/orderBy';
  import { mapGetters } from 'vuex';
  import API from '@/api';
  
  import MessageComposer from '@/components/MessageComposer';
  import Subtitle from '@/components/conversation/Subtitle';
  import Message from '@/components/conversation/Message';
  import MockMessage from '@/components/conversation/MockMessage';
  
  export default {
    name: 'time-segment',
    props: ['index', 'message', 'subtitle', 'contentSlug', 'classSlug'],
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
        segmentExpanded: false,
        segmentOpened: false,
        segmentPeeking: false,
        loadingMessages: false,
        segmentStyle: {},
        calculatedOffset: 0,
        calculatedOffsetBottom: 0,
      };
    },
    computed: {
      ...mapGetters([
        'activeSegment',
        'peekSegment',
        'activeSegmentMessages',
        'modalVisible',
        'replyingTo',
      ]),
      orderedMessages() {
        // Order messages
        return orderBy(this.activeSegmentMessages, ['createdAt'], ['asc']);
      },
      belowModal() {
        return this.modalVisible;
      }
    },
    methods: {
      peek() {
  
        if (!this.segmentOpened) {
  
          this.segmentStyle = {
            transition: 'height .3s ease'
          };
  
          this.$store.commit('PAUSE_MEDIA');
          this.$store.commit('SET_PEEK_SEGMENT', this.message.segmentGroup);
        }
      },
      unpeek() {
  
        // this.$store.commit('PLAY_MEDIA');
  
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
  
        }, 300); // Timeout equal to time for overlay to fade
      },
      openSegment() {
  
        if (this.segmentOpened) {
          return;
        }
  
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
      padding 20px
      text-align center
      h3
        reset()
        color $color-text-dark-grey

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
        height 12px
        width 12px

  &.peek, &.active
    radius(4px)
    z-index 56
    border none

    &.below-modal
      z-index 55 !important

  &.peek
    height 240px

  &.opened
    height auto
    .segment-expansion-bar
      opacity 0
      pointer-events none

    &.below-modal
      z-index 55 !important

  .meta-container
    animate()
    box-sizing()
    background-color $color-lightest-grey
    opacity 0
    padding 10px
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
      &.featured
        &:before
          radius(50%)
          content ''
          background-color $color-primary
          position absolute
          top 0
          left 0
          height 8px
          width 8px
      .tweet-actions
        background-color inherit
    &.active
      opacity 1

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

.status-indicator
  color $color-text-grey
  padding 40px
  text-align center

.segment-expansion-bar
  animate()
  background-color white
  color #999
  cursor pointer
  padding 5px 20px
  position absolute
  bottom 51px
  left 0
  right 0
  z-index 1
  text-align center
  &:hover
    background-color $color-lightest-grey
</style>
