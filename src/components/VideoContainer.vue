<template lang="pug">

  .video-wrapper

    youtube.video-container(v-if="src" v-bind:video-id="src" v-bind:player-vars="{'autoplay': 1, 'controls': 0, 'playsinline': 1, 'rel': 0, 'showinfo': 0, 'modestbranding': 1}" @ready="ready" @paused="paused" v-bind:player-width="pWidth" v-bind:player-height="pHeight" v-bind:style="playerStyle")

    .video-controls-overlay
      ul.video-controls
        li.video-control(@click="toggleVideoPlaying")
          icon(name="pause" v-if="videoPlaying")
          icon(name="play" v-else)
        .clearfix

</template>

<script>
const SYNC_THRESHOLD = 1.0;

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
    currentTime(nV, oV) {
      this.seek(this, nV);
    },
    videoPlaying(nv, oV) {
      if (this.player && this.src) {
        if (nv) {
          console.log('playVideo');
          this.player.playVideo();
        } else {
          console.log('pauseVideo');
          this.player.pauseVideo();
        }
      }
    },
  },
  methods: {
    toggleVideoPlaying() {
      if (this.videoPlaying) {
        this.$store.commit(types.PAUSE_VIDEO);
      } else {
        this.$store.commit(types.PLAY_VIDEO);
      }
    },
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
      if (!self.player) { return; }

      const playerTime = self.player.getCurrentTime();
      const outOfSync = ((this.currentTime < (playerTime - SYNC_THRESHOLD)) || (this.currentTime > (playerTime + SYNC_THRESHOLD)))

      if (outOfSync) {
        this.$log.log('Video out of sync - seeking');
        self.player.seekTo(position);
      }
    }, 200),
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
      this.$log.log('src changed');
      return (this.currentSection) ? this.currentSection.videoId : '';
    },
    ...mapGetters([
      'videoIsActive', 'videoEnabled', 'currentTime', 'currentSection', 'videoPlaying',
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

@import '../assets/stylus/shared'

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

  /* Video controls */
  .video-controls-overlay
    pinned()
    top auto
    position absolute
    ul.video-controls
      cleanlist()
      padding 5px
      li.video-control
        cleanlist()
        radius(50%)
        background-color alpha($color-primary, 1)
        float left
        height 20px
        padding 10px
        text-align center
        width 20px
        .fa-icon
          color alpha(white, 0.9)
          height 20px
        &:hover
          cursor pointer
          .fa-icon
            color white
</style>
