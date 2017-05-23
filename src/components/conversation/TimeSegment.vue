<template lang="pug">

  .time-segment(v-bind:class="{ active: activeSegmentVisible }" v-bind:style="activeSegmentVisible ? activeSegmentStyles : { top: (message.segmentGroup * 158.0) + 'px' }")

    .close-button.animated.tada(v-if="activeSegment" @click="exploreSegment(undefined)")
      p close

    .message-wrapper(@click="exploreSegment(message)")

      .message-count.animated.fadeIn(v-if="message.info && (message.info.total > 0) && !message.message.suggestion" v-bind:class="{ hide: activeSegment, low: (message.info.total > 0), medium: (message.info.total > 2), high: (message.info.total > 4) }")
        span(v-if="message.info.total !== 0") {{ message.info.total }}

      transition(name="fade")
        .suggestion(v-if="message.message && message.message.suggestion")
          h3 "{{ message.message.text }}"

      transition(name="fade")
        mock-message(v-if="message.loading || (message.info && (message.info.total === 0 && !message.message.suggestion))" v-bind:message="message")

      transition(name="fade")
        message(v-once v-if="message.info && (message.info.total > 0) && !message.message.suggestion" v-bind:message="message.message")

    .meta-container

      span(v-if="activeSegment")

        .full-width-loading(v-if="segmentMessages.length === 0")
          icon(name="refresh" scale="2" spin)

        .meta-container--messages(v-for="asMessage in segmentMessages")
          message(v-bind:message="asMessage")

</template>

<script>
import _ from 'lodash';
import API from '@/api';
import * as types from '@/store/mutation-types';

import Message from '@/components/conversation/Message';
import MockMessage from '@/components/conversation/MockMessage';
import Icon from 'vue-awesome/components/Icon';

export default {
  name: 'time-segment',
  props: ['message'],
  components: {
    Message,
    MockMessage,
  },
  watch: {
    activeSegmentVisible() {
      var self = this;
      setTimeout(function() {
        self.loadSegmentMessages();
      }, 500);
    },
  },
  data() {
    return {
      activeSegment: undefined,
      activeSegmentVisible: false,
      segmentMessages: [],
    };
  },
  methods: {
    exploreSegment(segment) {

      if (segment === undefined) {
        this.$log.log('Closing segment explorer');
        this.$store.commit(types.PLAY_VIDEO);
        this.activeSegment = undefined;
        this.activeSegmentVisible = false;
      } else {
        this.$log.log(`Exploring segment - ${segment.segmentGroup}`);
        this.$store.commit(types.PAUSE_VIDEO);

        this.activeSegment = segment;
        this.activeSegmentVisible = true;;

        const offsetHeight = window.innerHeight;
        const topPosition = this.$store.getters.currentSectionScrollPosition - offsetHeight + 140;
        const offsetWidth = document.getElementById('col-main').offsetWidth;
        const offsetPadding = 0.0;
        const offsetTop = 60.0;

        this.activeSegmentStyles = {
          top: `${topPosition + offsetTop + offsetPadding}px`,
          left: `-${((offsetWidth - (offsetPadding * 2)) / 2)}px`,
          right: `${offsetPadding}px`,
          height: `${(offsetHeight - offsetTop - 140 - (offsetPadding * 2))}px`,
        };
      }
    },
    loadSegmentMessages() {
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
  },
};
</script>

<style lang="stylus" scoped>

@import '../../assets/stylus/shared/*'

.suggestion
  padding 20px

.time-segment
  border transparent 1px solid
  height 158px
  position absolute
  left 0
  right 0
  top 0
  overflow scroll
  animate()
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
    border-color $color-light-grey
    background white
    z-index 50
    .message-wrapper
      border-bottom $color-light-grey 1px solid
      min-height 140px
    .meta-container
      background-color #f9f9f9
      border-bottom $color-light-grey 1px solid
      padding 5px
      .pure-button
        margin 10px

.full-width-loading
  padding 20px
  text-align center
  .fa-icon
    color $color-light-grey

.close-button
  radius(15px)
  background-color red
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

</style>
