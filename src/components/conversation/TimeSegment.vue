<template lang="pug">

  .time-segment(v-bind:class="{ active: segmentVisible }" v-bind:style="segmentVisible ? activeSegmentStyles : { top: (message.segmentGroup * 158.0) + 'px' }")

    .close-button(v-if="segmentVisible" @click="exploreSegment(undefined)")
      p close

    .explore-segment-button(@click="exploreSegment(message)")
      icon(name="angle-right")

    .message-wrapper

      .message-count.animated.fadeIn(v-if="message.info && (message.info.total > 0) && !message.message.suggestion" v-bind:class="{ hide: activeSegment, low: (message.info.total > 0), medium: (message.info.total > 2), high: (message.info.total > 4) }")
        span(v-if="message.info.total !== 0") {{ message.info.total }}

      transition(appear name="fade")
        .suggestion(v-if="message.message && message.message.suggestion")
          h3 "{{ message.message.text }}"

      transition(appear name="fade")
        mock-message(v-if="message.loading || (message.info && (message.info.total === 0 && !message.message.suggestion))" v-bind:message="message")

      transition(appear name="fade")
        message(v-once v-if="message.info && (message.info.total > 0) && !message.message.suggestion" v-bind:message="message.message")

    .full-width-loading(v-if="segmentVisible && !segmentMessages")
      icon(name="refresh" scale="2" spin)

    .quote-container(v-if="segmentVisible && quote")
      h1 {{ quote }}

    .meta-container(v-if="segmentVisible")

      .meta-container--messages(v-if="segmentMessages && (segmentMessages.length > 0)" v-for="asMessage in segmentMessages")
        message.animated.fadeIn(v-bind:message="asMessage")

</template>

<script>
import _ from 'lodash';
import {mapGetters} from 'vuex';
import API from '@/api';
import * as types from '@/store/mutation-types';

import Message from '@/components/conversation/Message';
import MockMessage from '@/components/conversation/MockMessage';
import Icon from 'vue-awesome/components/Icon';

export default {
  name: 'time-segment',
  props: ['message', 'subtitles'],
  components: {
    Message,
    MockMessage,
  },
  watch: {
    'lastMessage': {
      handler: function(nV, oV) {
        var self = this;
        setTimeout(function() {
          self.loadSegmentMessages();
        }, 500);
      },
      deep: true,
    },
    activeSegmentVisible() {
      var self = this;
      if (this.activeSegmentVisible && (this.activeSegment.segmentGroup === this.message.segmentGroup)) {

        setTimeout(function() {
          if (self.activeSegment) {
            self.activeSegmentStyles = {
              'overflow-y': 'auto',
              position: 'fixed',
              transition: 'none',
              top: '80px',
              left: 'calc(50% - 370px)',
              right: 'calc(50% - 370px)',
              height: (self.activeSegmentStyles) ? self.activeSegmentStyles.height : `auto`,
            };

            self.loadSegmentQuote();
            self.loadSegmentMessages();
          }
        }, 1000);
      }
    },
  },
  data() {
    return {
      segmentMessages: [],
      quote: '',
    };
  },
  computed: {
    ...mapGetters([
      'activeSegment',
      'activeSegmentVisible',
      'lastMessage',
    ]),
    segmentVisible() {
      return (this.activeSegmentVisible && this.activeSegment && (this.activeSegment.segmentGroup === this.message.segmentGroup));
    },
  },
  methods: {
    exploreSegment(segment) {

      this.segmentMessages = [];
      this.quote = undefined;

      if (segment === undefined) {
        this.$log.log('Closing segment explorer');

        this.$store.commit(types.SET_ACTIVE_SEGMENT, undefined);
        this.$store.commit(types.PLAY_VIDEO);
      } else {
        this.$log.log(`Exploring segment - ${segment.segmentGroup}`);

        this.$store.commit(types.PAUSE_VIDEO);

        this.$store.commit(types.SET_ACTIVE_SEGMENT, segment);

        const offsetHeight = window.innerHeight;
        const topPosition = this.$store.getters.currentSectionScrollPosition - offsetHeight + 140;
        const offsetWidth = document.getElementById('col-main').offsetWidth;
        const offsetPadding = 20.0;
        const offsetTop = 80.0;
        const offsetBottom = 160.0;

        this.activeSegmentStyles = {
          top: `${topPosition + offsetTop}px`,
          left: `-${((offsetWidth - (offsetPadding * 2)) / 2)}px`,
          right: `${offsetPadding}px`,
          height: `${(offsetHeight - offsetTop - offsetBottom)}px`,
        };
      }
    },
    loadSegmentMessages() {

      this.$log.log('Loading segment messages');

      let theContent = '';

      if (this.message.message && this.message.message.content) {
        theContent = this.message.message.content;
      } else {
        theContent = this.$store.getters.currentSection.slug;
      }

      const request = {
        theClass: this.$store.getters.currentClass.slug,
        theContent: theContent,
        startSegment: `${_.floor(parseInt(this.message.segmentGroup) / 0.2, 5)}`,
        endSegment: `${_.floor(parseInt(this.message.segmentGroup) / 0.2, 5) + 5}`,
      };

      API.message.getMessages(
        request,
        response => {
          this.$log.log(response.data);
          this.segmentMessages = _.orderBy(response.data, ['createdAt'], ['desc']);
        },
        response => {
          alert('There was an error');
          this.segmentMessages = [];
        },
      );

      // API.message.subscribe(
      //   request,
      //   response => {
      //     this.$log.log(response.data);
      //     this.segmentMessages = _.orderBy(response.data, ['createdAt'], ['asc']);
      //   },
      //   response => {
      //     alert('There was an error');
      //     this.segmentMessages = [];
      //   },
      // );

    },
    loadSegmentQuote() {

      // Get quote for active segment
      const segmentStart = (this.activeSegment.segmentGroup * 5);
      const segmentEnd = segmentStart + 5;

      let quotes = _.filter(this.subtitles, function(o) {
        return (parseInt(o.start) > segmentStart);
      });

      let quote = _.first(quotes);

      this.quote = quote.text;

      // let quotes = _.filter(this.subtitles, function(o) {
      //   return ((o.start > segmentStart) && (o.end < segmentEnd));
      // });

      // quotes = _.map(quotes, function(o) {
      //   return o.text;
      // });
      //
      // this.quote = _.join(quotes, ' ');
    },
  },
};
</script>

<style lang="stylus">

@import '~stylus/shared'

.suggestion
  padding 20px

.time-segment
  segment-transition()
  height 158px
  padding-right 25px
  position absolute
  left 0
  right 0
  top 0
  overflow hidden
  .message-wrapper
    background-color transparent
    transition('background-color' 0.3s linear)
    .message
      max-height 98px
      margin 15px 15px 0 15px
  .explore-segment-button
    position absolute
    top 0
    bottom 0
    right 0
    width 40px
    z-index 1
    .fa-icon
      color $color-dark-grey
      height 100%
      margin 0 15px
      width 10px
    &:hover
      cursor pointer
  .message-count
    radius(13px)
    background-color $color-primary
    color white
    font-size 0.8em
    line-height 14px
    min-width 14px
    padding 6px
    position absolute
    text-align center
    top 5px
    right 5px
    animate()
    &.low
      background-color $color-success
    &.medium
      background-color $color-warning
    &.high
      background-color $color-danger
    &.hide
      opacity 0

  &.active
    segment-transition()
    background-color #f2f2f2
    border-top-left-radius 6px
    border-top-right-radius 6px
    z-index 51
    padding-right 0
    .explore-segment-button
      display none
    .message-wrapper
      background-color white
      border-bottom $color-light-grey 1px solid
      padding 1px
      .message-count
        display none
      .mock-message
        position relative
      .suggestion
        text-align center
    .meta-container
      min-height 100px
      .meta-container--no-content
        padding 40px
        text-align center
        h1
          color $color-text-light-grey
      .meta-container--messages
        .message
          margin 15px 15px 0 15px
    .quote-container
      background-color transparent
      height 80px
      overflow hidden
      position fixed
      top 0
      left 0
      right 0
      text-align center
      h1
        reset()
        color white
        font-size 20px
        line-height 80px
        padding 0 20px
    @media(max-width: 800px)
      left 10px !important
      right 10px !important

.full-width-loading
  padding 20px
  text-align center
  .fa-icon
    color $color-light-grey

.close-button
  radius(15px)
  background-color $color-primary
  border white 1px solid
  position absolute
  top 5px
  right 5px
  height 30px
  min-width 30px
  z-index 53
  p
    reset()
    color white
    line-height 30px
    padding 0 10px
  &:hover
    cursor pointer
    background-color white
    p
      color $color-primary


.slide-fade-enter-active
  transition all 1s ease-out

.slide-fade-leave-active
  transition all 0.1s linear

.slide-fade-enter, .slide-fade-leave-to
  opacity 0
  height 0

</style>
