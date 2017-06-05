<template lang="pug">

  #action-panel.animated.slideInUp(v-bind:class="{ hidden: !videoIsActive, 'segment-view': activeSegmentVisible }")
    playhead
    video-container
    message-composer

</template>

<script>
import MessageComposer from '@/components/MessageComposer';
import VideoContainer from '@/components/VideoContainer';
import Playhead from '@/components/Playhead';

export default {
  name: 'action-panel',
  props: ['videoIsActive', 'activeSegmentVisible'],
  components: {
    MessageComposer,
    VideoContainer,
    Playhead,
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

#action-panel
  animate()
  background-color white
  position fixed
  bottom 0
  left 50%
  margin-left -400px
  height 140px
  width 800px
  z-index 50

  @media(max-width: 800px)
    left 0
    margin-left 0
    width 100%

  &.segment-view
    bottom 20px
    border-bottom-left-radius 6px
    border-bottom-right-radius 6px
    margin-left -370px
    width 740px
    z-index 52
    .video-wrapper
      margin-left -370px
    @media(max-width: 800px)
      left 0
      margin-left 10px
      width calc(100% - 20px)

</style>
