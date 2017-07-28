<template lang="pug">

  .video-wrapper

    #media-overlay
      //- pre {{ currentSegmentIndex }}
      span(v-for="(mediaItem, index) in mediaItems")
        img.media-item-tile(v-bind:src="mediaItem" v-bind:class="{ active: (currentSegmentIndex === index) }")

      //- .media-tile#previous(v-bind:style="{ 'background-image': `url(${previousMedia})` }")
      //- .media-tile#current(v-bind:style="{ 'background-image': `url(${currentMedia})` }")
      //- .media-tile#next(v-bind:style="{ 'background-image': `url(${nextMedia})` }")

    youtube.video-container(v-if="src" v-bind:video-id="src" v-bind:player-vars="{'autoplay': 1, 'controls': 0, 'playsinline': 1, 'rel': 0, 'showinfo': 0, 'modestbranding': 1}" @ready="ready" @paused="paused" v-bind:player-width="pWidth" v-bind:player-height="pHeight" v-bind:style="playerStyle")

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
      currentSegmentIndex: 0,
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
      if (document.documentElement.clientWidth < 800) {
        const percentage = 0.8;
        this.pHeight = (((document.documentElement.clientWidth / 2) * percentage) * 0.5625);
        this.pWidth = ((document.documentElement.clientWidth / 2) * percentage);
      } else {
        this.pHeight = 219;
        this.pWidth = (219 / 0.5625);
      }
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
    currentMedia() {
      if (this.media.length === 0) { return ''; }

      let media = `https://github.com/connectedacademy/testclass/raw/master/course/content/en/class1/transcripts/${this.media[0].text}`;

      for (var i = 0; i < this.media.length; i++) {
        const image = this.media[i];
        if (this.currentSegment > (image.start) && this.currentSegment < (image.end)) {
          this.currentSegmentIndex = i;
          media = `https://github.com/connectedacademy/testclass/raw/master/course/content/en/class1/transcripts/${image.text}`
          return media;
        }
      }

      return media;
    },
    previousMedia() {
      if (!this.media[this.currentSegmentIndex - 1]) {
        return '';
      }
      const image = this.media[this.currentSegmentIndex - 1];
      const media = `https://github.com/connectedacademy/testclass/raw/master/course/content/en/class1/transcripts/${image.text}`
      return media;
    },
    nextMedia() {
      if (!this.media[this.currentSegmentIndex + 1]) {
        return '';
      }
      const image = this.media[this.currentSegmentIndex + 1];
      const media = `https://github.com/connectedacademy/testclass/raw/master/course/content/en/class1/transcripts/${image.text}`
      return media;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.video-wrapper
  animate()
  background white
  padding 0
  position relative
  // top 100px
  height 120px
  overflow hidden
  border-top $color-border 1px solid
  #media-overlay
    pinned()
    // background-color $color-darkest-grey
    padding 4px
    .media-item-tile
      border transparent 4px solid
      height calc(120px - 16px)
      width auto
      &.active
        border-color $color-darkest-grey
    .media-tile
      pinned()
      background-image()
      // background-color $color-darkest-grey
      background-size contain
      position absolute
      &#current
        background-position left
        top 0
        bottom 0
        width 100%

      &#previous, &#next
        // border alpha(white, 0.2) 2px solid
        display none
        opacity 1
        bottom 20px
        z-index 1
        width 15%
        top 20px
      &#previous
        background-position left
        left 400px
        right auto
      &#next
        background-position right
        right 400px
        left auto

  .video-container
    opacity 0
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
