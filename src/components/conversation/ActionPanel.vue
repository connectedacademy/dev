<template lang="pug">

  #action-panel(v-bind:class="{ hide: composerHidden, pinned: (this.currentSectionScrollPosition > 0), 'segment-view': (activeSegment !== undefined) }")
    icon#twitter-branding(name="twitter" scale="2")
    ul#experience-controls
      li.experience-control(@click="toggleVideoPlaying")
        icon(name="pause" v-if="videoPlaying")
        icon(name="play" v-else)
      li.experience-control(@click="toggleComposer")
        icon(name="photo")
      .clearfix
    video-container



</template>

<script>
import * as types from '@/store/mutation-types';
import {mapGetters} from 'vuex';

import MessageComposer from '@/components/MessageComposer';
import VideoContainer from '@/components/VideoContainer';

export default {
  name: 'action-panel',
  props: ['composerHidden', 'activeSegment'],
  components: {
    MessageComposer,
    VideoContainer,
  },
  computed: {
    ...mapGetters(['videoPlaying', 'currentSectionScrollPosition']),
  },
  methods: {
    toggleComposer() {
      this.$store.commit(this.composerHidden ? types.SHOW_COMPOSER : types.HIDE_COMPOSER);
    },
    toggleVideoPlaying() {
      this.$store.commit(this.videoPlaying ? types.PAUSE_VIDEO : types.PLAY_VIDEO);
    },
  }
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

#action-panel
  animate()
  background white
  border-top $color-border 1px solid
  height 170px
  z-index 50

  bottom -170px
  overflow hidden
  position fixed
  left 50%
  margin-left -390px
  width 780px

  #twitter-branding
    animate()
    color $color-text-light-grey
    position absolute
    top 10px
    right 10px
    z-index 2
  &.pinned
    bottom -120px
  &.hide
    bottom -0px

  @media(max-width: 800px)
    margin-left 0
    left 0
    width 100%

  &.segment-view
    bottom -120px

  ul#experience-controls
    cleanlist()
    box-sizing border-box
    height 50px
    z-index 1

    li.experience-control
      cleanlist()
      animate()
      float left
      &.pull-right
        float right
        border none
      .fa-icon
        animate()
        color $color-text-dark-grey
        display block
        font-size 0.5em
        height 30px
        width 20px
        margin 10px 15px
      &:hover
        background-color $color-lighter-grey
        cursor pointer
</style>
