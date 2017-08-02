<template lang="pug">

  #media-wrapper

    #video-wrapper
      youtube#video-container(v-if="src" v-bind:video-id="src" v-bind:player-vars="{'autoplay': 1, 'controls': 0, 'playsinline': 1, 'rel': 0, 'showinfo': 0, 'modestbranding': 1}" @ready="ready" @paused="paused" v-bind:player-width="pWidth" v-bind:player-height="pHeight" v-bind:style="playerStyle")

    #images-wrapper
      img.image-tile(v-for="(mediaItem, index) in mediaItems" v-bind:src="mediaItem" v-bind:class="{ active: (currentSegmentIndex === index) }")
      .clearfix
</template>

<script>
const SYNC_THRESHOLD = 1.0;

import _ from 'lodash';
import { mapGetters } from 'vuex';
import * as types from '@/store/mutation-types';

export default {
  name: 'media-container',
  mounted() {
    this.$nextTick(function() {
      window.addEventListener('resize', this.getWindowWidth);
      this.getWindowWidth();
    });
  },
  data() {
    return {
      pHeight: 188,
      pWidth: (188 / 0.5625),
    };
  },
  watch: {
    currentTime(nV, oV) {
      this.seek(this, nV);
    },
    videoPlaying(nv, oV) {
      if (this.player && this.src) {
        if (nv) {
          this.$log.log('playVideo');
          this.player.playVideo();
        } else {
          this.$log.log('pauseVideo');
          this.player.pauseVideo();
        }
      }
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
      if (!self.player) { return; }

      const playerTime = self.player.getCurrentTime();
      const outOfSync = ((this.currentTime < (playerTime - SYNC_THRESHOLD)) || (this.currentTime > (playerTime + SYNC_THRESHOLD)))

      if (outOfSync) {
        this.$log.log('Video out of sync - seeking');
        self.player.seekTo(position);
      }
    }, 200),
    getWindowWidth: _.throttle(function(event) {
      // this.pHeight = 190;
      // this.pWidth = (190 / 0.5625);
    }, 500),
  },
  computed: {
    ...mapGetters([
      'videoIsActive', 'videoEnabled', 'currentTime', 'currentSection', 'videoPlaying', 'media', 'currentSegment',
    ]),
    src() {
      this.$log.log('src changed');
      return (this.currentSection) ? this.currentSection.videoId : '';
    },
    playerStyle() {
      return {
        height: `${this.pHeight}px`,
        width: `${this.pWidth}px`,
      };
    },
    mediaItems() {
      let mediaItems = [];

      if (this.media.length === 0) { return mediaItems; }

      let media = `https://github.com/connectedacademy/testclass/raw/master/course/content/en/class1/transcripts/${this.media[0].text}`;

      for (var i = 0; i < this.media.length; i++) {
        const image = this.media[i];
        media = `https://github.com/connectedacademy/testclass/raw/master/course/content/en/class1/transcripts/${image.text}`
        mediaItems.push(media);
      }

      return mediaItems;
    },
    currentSegmentIndex() {
      if (this.media.length === 0) { return 0; }

      let media = `https://github.com/connectedacademy/testclass/raw/master/course/content/en/class1/transcripts/${this.media[0].text}`;

      for (var i = 0; i < this.media.length; i++) {
        const image = this.media[i];
        if (this.currentSegment > (image.start) && this.currentSegment < (image.end)) {
          return i;
        }
      }
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

$media-height = 220px

#media-wrapper
  animate()
  padding 0 8px
  padding-left (188px / 0.5625) + 32px
  position relative
  height $media-height
  overflow-x scroll
  overflow-y hidden
  #images-wrapper
    background white
    padding 8px
    white-space nowrap
    .image-tile
      animate()
      height ($media-height - 32px)
      margin 8px
      opacity 0.5
      width auto
      &.active
        opacity 1

  #video-wrapper
    border-right $color-border 1px solid
    top 0
    bottom 0
    left 0
    right auto
    padding 16px
    position absolute
    #video-container
      pinned()
      background red
      opacity 1
      box-sizing border-box
      overflow hidden

      iframe, object, embed, video
        position absolute !important
        top 0 !important
        bottom 0 !important
        left 0 !important
        right 0 !important

</style>
