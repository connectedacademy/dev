<template lang="pug">

  .video-wrapper
    .video-controls(hidden)
      button.pure-button(@click="pause") Pause
      button.pure-button(@click="play") Play
      button.pure-button(@click="seek") Seek
    youtube.video-container(v-bind:video-id="videoSrc" v-bind:player-vars="{'autoplay': 1, 'controls': 0, 'playsinline': 1, 'rel': 0, 'showinfo': 0, 'modestbranding': 1}" @ready="ready" @playing="playing" player-width="auto" player-height="auto")

</template>

<script>
import _ from 'lodash';

export default {
  name: 'video-container',
  props: ['videoSrc'],
  data() {
    return {
      msg: 'Welcome to Connected Academy',
    };
  },
  watch: {
    scrollPosition(oldPosition, newPosition) {
      this.seek();
      // _.debounce(this.seek(), 5000);
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
      return `http://www.youtube.com/embed/${this.videoSrc}`;
    },
    scrollPosition() {
      return this.$store.getters.scrollPosition;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import "../assets/stylus/shared/*"

</style>
