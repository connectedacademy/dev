<template lang="pug">

  .time-segment(v-bind:class="{ active: segmentVisible }" v-bind:style="segmentVisible ? activeSegmentStyles : { top: (message.segmentGroup * 158.0) + 'px' }")

    .close-button.animated.tada(v-if="segmentVisible" @click="exploreSegment(undefined)")
      p close

    .explore-segment-button(@click="exploreSegment(message)" v-if="!message.loading && (message.info && (message.info.total > 0 && !message.message.suggestion))")
      icon(name="angle-right")

    transition(name="slide-fade")
      .quote-container(v-if="segmentVisible && quote")
        h1 {{ quote }}

    .message-wrapper

      .message-count.animated.fadeIn(v-if="message.info && (message.info.total > 0) && !message.message.suggestion" v-bind:class="{ hide: activeSegment, low: (message.info.total > 0), medium: (message.info.total > 2), high: (message.info.total > 4) }")
        span(v-if="message.info.total !== 0") {{ message.info.total }}

      transition(name="fade")
        .suggestion(v-if="message.message && message.message.suggestion")
          h3 "{{ message.message.text }}"

      transition(name="fade")
        mock-message(v-if="message.loading || (message.info && (message.info.total === 0 && !message.message.suggestion))" v-bind:message="message")

      transition(name="fade")
        message(v-once v-if="message.info && (message.info.total > 0) && !message.message.suggestion" v-bind:message="message.message")

    .full-width-loading(v-if="segmentVisible && !segmentMessages")
      icon(name="refresh" scale="2" spin)

    //- transition(name="fade")
    .meta-container--messages(v-if="segmentMessages" v-for="asMessage in segmentMessages")
        message(v-bind:message="asMessage")

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
    activeSegmentVisible() {
      var self = this;
      if (this.activeSegmentVisible) {
        setTimeout(function() {
          if (self.activeSegment) {
            self.activeSegmentStyles = {
              transition: 'none',
              position: 'fixed',
              top: `${60}px`,
              left: 'calc(50% - 390px)',
              right: 'calc(50% - 390px)',
              height: (self.activeSegmentStyles) ? self.activeSegmentStyles.height : `auto`,
            };
          }
          setTimeout(function() {
            self.loadSegmentMessages();
            self.loadSegmentQuote();
          }, 600);
        }, 600);
      }
    },
  },
  data() {
    return {
      segmentMessages: undefined,
      quote: undefined,
    };
  },
  computed: {
    ...mapGetters([
      'activeSegment',
      'activeSegmentVisible',
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

        this.$store.commit(types.SET_ACTIVE_SEGMENT, segment);
        this.$store.commit(types.PAUSE_VIDEO);

        const offsetHeight = window.innerHeight;
        const topPosition = this.$store.getters.currentSectionScrollPosition - offsetHeight + 140;
        const offsetWidth = document.getElementById('col-main').offsetWidth;
        const offsetPadding = 0.0;
        const offsetTop = 60.0;

        this.activeSegmentStyles = {
          top: `${topPosition + offsetTop + offsetPadding}px`,
          left: `-${((offsetWidth - (offsetPadding * 2)) / 2)}px`,
          right: `${offsetPadding}px`,
          // height: `${(offsetHeight - offsetTop - 140 - (offsetPadding * 2))}px`,
          height: `${(offsetHeight - offsetTop - 60 - (offsetPadding * 2))}px`,
        };
      }
    },
    loadSegmentMessages() {
      if (!(this.message.message && this.message.message.content)) {
        this.segmentMessages = [];
        return;
      }

      const request = {
        theClass: this.$store.getters.currentClass.slug,
        theContent: this.message.message.content,
        startSegment: `${(parseInt(this.message.segmentGroup) / 0.2)}`,
        endSegment: `${(parseInt(this.message.segmentGroup) / 0.2) + 5}`,
      };

      API.message.getMessages(
        request,
        response => {
          this.segmentMessages = response.data;
        },
        response => {
          alert('There was an error');
          this.segmentMessages = [];
        },
      );
    },
    loadSegmentQuote() {

      // Get quote for active segment
      const time = (this.activeSegment.segmentGroup / 0.2);

      const quote = _.find(this.subtitles, function(o) {
        return o.start > time;
      });

      this.quote = `"${quote.text}"`;

    },
  },
};
</script>

<style lang="stylus" scoped>

@import '../../assets/stylus/shared/*'

.suggestion
  padding 20px

.time-segment
  background #f2f2f2
  transition-duration 0.1s
  height 158px
  padding-right 25px
  position absolute
  left 0
  right 0
  top 0
  overflow hidden
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

  &.active
    radius(6px)
    transition-duration 0.6s
    background white
    z-index 51
    padding-right 0
    overflow scroll
    .explore-segment-button
      display none
    .message-wrapper
      border-bottom $color-light-grey 1px solid
      .message-count
        display none
      .mock-message
        position relative
    .meta-container
      background-color #f9f9f9
      border-bottom $color-light-grey 1px solid
      padding 5px
      .pure-button
        margin 10px
    .quote-container
      background-color $color-primary
      padding 30px 0
      text-align center
      h1
        nomargin()
        color white
        line-height 50px
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
  &:hover
    cursor pointer
  p
    nomargin()
    nopadding()
    color white
    line-height 30px
    padding 0 10px

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active
  transition all 1s ease-out

.slide-fade-leave-active
  transition all 0.1s linear

.slide-fade-enter, .slide-fade-leave-to
  opacity 0
  height 0

</style>
