<template lang="pug">

  .video-wrapper.animated.fadeInUp(v-if="isActive")
    .video-controls(hidden)
      button.pure-button(@click="pause") Pause
      button.pure-button(@click="play") Play
      button.pure-button(@click="seek") Seek
    youtube.video-container(v-bind:video-id="src" v-bind:player-vars="{'autoplay': 1, 'controls': 0, 'playsinline': 1, 'rel': 0, 'showinfo': 0, 'modestbranding': 1}" @ready="ready" @playing="playing" player-width="auto" player-height="auto")

</template>

<script>
import _ from 'lodash';

export default {
  name: 'video-container',
  data() {
    return {
      msg: 'Welcome to Connected Academy',
    };
  },
  watch: {
    scrollPosition(oldPosition, newPosition) {
      this.seek();
      // _.debounce(this.seek, 1000);
    },
  },
  methods: {
    ready(player) {
      this.player = player;
      this.play();
    },
    playing(player) {
      // The player is playing a video.
    },
    change() {
      // this.videoId = 'another video id';
    },
    seek() {
      this.player.seekTo(this.scrollPosition);
    },
    play() {
      this.player.playVideo();
    },
    stop() {
      this.player.stopVideo();
    },
    pause() {
      this.player.pauseVideo();
    },
  },
  computed: {
    src() {
      return this.$store.getters.currentSection.videoId;
    },
    isActive() {
      return this.$store.getters.videoIsActive;
    },
    scrollPosition() {
      return this.$store.getters.currentSectionSegment;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '../assets/stylus/shared/*'

.video-wrapper
  bottom 20px
  right 20px
  position fixed
  z-index 52
  width 300px
  .video-container
    background-color black
    box-sizing border-box
    height 0
    overflow hidden
    padding 0
    padding-bottom 56.25%
    position relative
    width 100%
iframe, object, embed
  position absolute !important
  top 0 !important
  bottom 0 !important
  left 0 !important
  right 0 !important
  width 100% !important
  height 100% !important

</style>
