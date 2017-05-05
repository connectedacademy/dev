<template lang="pug">

  .video-wrapper.animated.fadeIn(v-if="videoIsActive && videoEnabled")

    .video-controls.hidden
      button.pure-button(@click="pause") Pause
      button.pure-button(@click="play") Play
      button.pure-button(@click="seek") Seek

    youtube.video-container(v-bind:video-id="src" v-bind:player-vars="{'autoplay': 1, 'controls': 1, 'playsinline': 1, 'rel': 0, 'showinfo': 0, 'modestbranding': 1}" @ready="ready" @playing="playing" v-bind:player-width="pWidth" v-bind:player-height="pHeight" v-bind:style="playerStyle")

</template>

<script>
/* eslint-disable */
import _ from 'lodash';
import { mapGetters } from 'vuex';

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
    currentTime(oldTime, newTime) {
      this.seek(this, this.currentTime);
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
    }, 500, { leading: false, trailing: true }),
    play() {
      this.player.playVideo();
      this.$store.video.commit('playing', true);
    },
    stop() {
      this.player.stopVideo();
      this.$store.video.commit('playing', false);
    },
    pause() {
      this.player.pauseVideo();
      this.$store.video.commit('playing', true);
    },
    getWindowWidth(event) {
      if (document.documentElement.clientWidth < 800) {
        const percentage = 0.8;
        this.pHeight = (((document.documentElement.clientWidth / 2) * percentage) * 0.5625);
        this.pWidth = ((document.documentElement.clientWidth / 2) * percentage);
      } else {
        this.pHeight = 120;
        this.pWidth = (120 / 0.5625);
      }

    },
  },
  computed: {
    src() {
      return this.$store.getters.currentSection.videoId;
    },
    ...mapGetters([
      'videoIsActive', 'videoEnabled', 'currentTime',
    ]),
    playerStyle() {
      return {
        height: `${this.pHeight}px`,
        width: `${this.pWidth}px`,
      };
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '../assets/stylus/shared/*'

.video-wrapper
  background-color darken($color-purple, 25%)
  border-right $color-purple 1px solid
  bottom 0
  padding 10px
  padding-left 0
  left 50%
  margin-left -400px
  position fixed
  z-index 52
  animate()
  @media(max-width: 800px)
    bottom 150px
    left 10px
    margin-left 0
    padding 0
  .video-container
    box-sizing border-box
    overflow hidden
    padding 0
    position relative

  iframe, object, embed, video
    position absolute !important
    top 0 !important
    bottom 0 !important
    left 0 !important
    right 0 !important

</style>
