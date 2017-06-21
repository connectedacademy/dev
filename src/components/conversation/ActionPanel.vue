<template lang="pug">

  #action-panel.animated.slideInUp(v-bind:class="{ hide: composerHidden, hidden: !videoIsActive, 'segment-view': activeSegmentVisible }")
    video-container
    message-composer
    ul#experience-controls
      li.experience-control(@click="toggleVideoPlaying")
        icon(name="pause" v-if="videoPlaying")
        icon(name="play" v-else)
      li.experience-control(@click="toggleComposer")
        icon(name="eye")
      .clearfix


</template>

<script>
import * as types from '@/store/mutation-types';
import {mapGetters} from 'vuex';

import MessageComposer from '@/components/MessageComposer';
import VideoContainer from '@/components/VideoContainer';

export default {
  name: 'action-panel',
  props: ['composerHidden', 'videoIsActive', 'activeSegmentVisible'],
  components: {
    MessageComposer,
    VideoContainer,
  },
  computed: {
    ...mapGetters(['videoPlaying']),
  },
  methods: {
    toggleComposer() {
      if (this.composerHidden) {
        this.$store.commit(types.SHOW_COMPOSER);
      } else {
        this.$store.commit(types.HIDE_COMPOSER);
      }
    },
    toggleVideoPlaying() {
      if (this.videoPlaying) {
        this.$store.commit(types.PAUSE_VIDEO);
      } else {
        this.$store.commit(types.PLAY_VIDEO);
      }
    },
  }
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

#action-panel
  animate()
  background-color white
  border-top $color-border 1px solid
  position fixed
  bottom 0
  left 50%
  margin-left -390px
  height 219px
  width 780px
  z-index 50

  @media(max-width: 800px)
    left 0
    margin-left 0
    width 100%
  &.hide
    bottom -160px

  &.segment-view
    margin-left -370px
    width 740px
    z-index 57
    /*.video-wrapper
      margin-left -370px*/
    @media(max-width: 800px)
      left 0
      margin-left 10px
      width calc(100% - 20px)
      .playhead-bobble
        display none

ul#experience-controls
  cleanlist()
  background-color $color-lightest-grey
  height 60px
  left calc(219px / 0.5625 + 1px)
  right 0
  position absolute
  top 0
  right 0
  li.experience-control
    cleanlist()
    float left
    border-left $color-border 1px solid

    .fa-icon
      color $color-text-dark-grey
      display block
      font-size 0.7em
      height 30px
      width 30px
      margin 15px
</style>
