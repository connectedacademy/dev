<template lang="pug">

  .video-wrapper(v-if="videoIsActive")

    youtube.video-container(v-bind:video-id="src" v-bind:player-vars="{'autoplay': 1, 'controls': 1, 'playsinline': 1, 'rel': 0, 'showinfo': 0, 'modestbranding': 1}" @ready="ready" @paused="paused" @playing="playing" v-bind:player-width="pWidth" v-bind:player-height="pHeight" v-bind:style="playerStyle")

</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import * as types from '@/store/mutation-types';

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
    change() {},
    ready(player) {
      this.player = player;
      this.player.seekTo(this.currentTime);
      this.$store.commit(types.VIDEO_READY);
    },
    playing(player) {
      this.$store.commit(types.PLAY_VIDEO);
    },
    ended() {
      this.$store.commit(types.PAUSE_VIDEO);
    },
    buffering() {
      this.$store.commit(types.PAUSE_VIDEO);
    },
    paused() {
      this.$store.commit(types.PAUSE_VIDEO);
    },
    seek: _.throttle(function(self, position) {
      if (!this.canAutoScroll && self.player) {
        self.player.seekTo(position);
      }
    }, 1000),
    getWindowWidth: _.throttle(function(event) {
      if (document.documentElement.clientWidth < 800) {
        const percentage = 0.8;
        this.pHeight = (((document.documentElement.clientWidth / 2) * percentage) * 0.5625);
        this.pWidth = ((document.documentElement.clientWidth / 2) * percentage);
      } else {
        this.pHeight = 140;
        this.pWidth = (140 / 0.5625);
      }
      this.pHeight = (this.pHeight > 140) ? 140 : this.pHeight;
      this.pWidth = (this.pWidth > (140 / 0.5625)) ? (140 / 0.5625) : this.pWidth;
    }, 500),
  },
  computed: {
    src() {
      return this.currentSection.videoId;
    },
    ...mapGetters([
      'videoIsActive', 'videoEnabled', 'currentTime', 'canAutoScroll', 'currentSection',
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
  padding 0
  padding-left 0
  left 50%
  margin-left -400px
  position fixed
  z-index 52
  animate()
  @media(max-width: 800px)
    bottom 140px
    left 0
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
