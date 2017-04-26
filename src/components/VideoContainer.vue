<template lang="pug">

  .video-wrapper.animated.fadeInUp(v-if="isActive")
    .video-controls(hidden)
      button.pure-button(@click="pause") Pause
      button.pure-button(@click="play") Play
      button.pure-button(@click="seek") Seek
    youtube.video-container(v-bind:video-id="src" v-bind:player-vars="{'autoplay': 1, 'controls': 0, 'playsinline': 1, 'rel': 0, 'showinfo': 0, 'modestbranding': 1}" @ready="ready" @playing="playing" v-bind:player-width="pWidth" v-bind:player-height="pHeight")

</template>

<script>
/* eslint-disable */
import _ from 'lodash';

export default {
  name: 'video-container',
  mounted() {
    this.$nextTick(function() {
      window.addEventListener('resize', this.getWindowWidth);
      this.getWindowWidth();
    });
  },
  data() {
    return {
      msg: 'Welcome to Connected Academy',
      pHeight: 90,
      pWidth: 160,
    };
  },
  watch: {
    currentVideoTime(oldTime, newTime) {
      this.seek(this, this.currentVideoTime);
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
    seek: _.throttle(function(self, position) {
      if (!this.$store.state.autoPlaying && self.player) {
        self.player.seekTo(position);
      }
    }, (100), { leading: false, trailing: true }),
    play() {
      this.player.playVideo();
    },
    stop() {
      this.player.stopVideo();
    },
    pause() {
      this.player.pauseVideo();
    },
    getWindowWidth(event) {
      if (document.documentElement.clientWidth < 600)
      {
        this.pHeight = 112;
        this.pWidth = 200;
      }
      else
      {
        this.pHeight = 169;
        this.pWidth = 300;
      }
    },
  },
  computed: {
    src() {
      return this.$store.getters.currentSection.videoId;
    },
    isActive() {
      return this.$store.getters.videoIsActive;
    },
    currentVideoTime() {
      return this.$store.getters.currentVideoTime;
    },
    currentSectionSegment() {
      return this.$store.getters.currentSectionSegment;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '../assets/stylus/shared/*'

.video-wrapper
  bottom 65px
  right 20px
  position fixed
  z-index 52
  width 300px
  @media(max-width: 600px)
    bottom auto
    top 135px
    right 15px
    width 200px
  .video-container
    background-color black
    box-sizing border-box
    height 0
    overflow hidden
    padding 0
    padding-bottom 56.25%
    position relative
    width 100%

  iframe, object, embed, video
    position absolute !important
    top 0 !important
    bottom 0 !important
    left 0 !important
    right 0 !important

</style>
