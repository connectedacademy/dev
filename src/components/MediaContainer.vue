<template lang="pug">

  #media-wrapper(v-bind:class="{ 'soundcloud-mode': (src && playerType === 'soundcloud'), 'youtube-mode': (src && playerType === 'youtube') }")

    #video-wrapper
      youtube#video-container(v-if="src && (this.playerType === 'youtube')" v-bind:video-id="src" v-bind:player-vars="{'autoplay': 1, 'controls': 0, 'playsinline': 1, 'rel': 0, 'showinfo': 0, 'modestbranding': 1}" @ready="youtubeReady" @playing="youtubePlaying" @paused="youtubePaused" @ended="youtubeEnded" v-bind:player-width="pWidth" v-bind:player-height="pHeight" v-bind:style="{ height: `${this.pHeight}px`, width: `${this.pWidth}px` }")
      #soundcloud-container(v-if="src && (this.playerType === 'soundcloud')")
        img(src="../assets/icons/soundcloud.png")
    
    #images-wrapper
      #image-current(@click="setLightboxMedia(mediaItems[currentSegmentIndex])")
        .image-tile.active(v-bind:style="{ 'background-image': `url('https://${course.slug}.connectedacademy.io/course/content/media/small/${mediaItems[currentSegmentIndex]}')` }")
      .image-thumbnails
        .image-tile(v-for="(mediaItem, index) in mediaItems" v-bind:style="{ 'background-image': `url('https://${course.slug}.connectedacademy.io/course/content/media/thumb/${mediaItem}')` }" @click="setLightboxMedia(mediaItem)")
        .clearfix

</template>

<script>
const SYNC_THRESHOLD = 1.0;

import * as config from '@/api/config';
import _ from 'lodash';
import { mapGetters } from 'vuex';
import * as types from '@/store/mutation-types';

import SoundCloud from 'soundcloud';

export default {
  name: 'media-container',
  props: ['player-type'],
  data() {
    return {
      lightboxVisible: false,
      lightboxImage: undefined,
      soundcloudPlayer: undefined,
      pHeight: 188,
      pWidth: (188 / 0.5625),
    };
  },
  watch: {
    playerType(nV, oV) {
      if (nV === 'soundcloud') {
        this.initializeSoundcloudPlayer();
        if (this.soundcloudPlayer) this.soundcloudPlayer.play();
      }

      if (oV === 'soundcloud') {
        if (this.soundcloudPlayer) this.soundcloudPlayer.pause();
      }
    },
    currentTime(nV, oV) {
      if (this.playerType === 'youtube' && this.player) this.youtubeSeek(this, nV);
      if (this.playerType === 'soundcloud' && this.soundcloudPlayer) this.soundcloudSeek(this, nV);
    },
    videoPlaying(nv, oV) {
      this.$log.info(nv ? 'play' : 'pause');
      if (nv) {
        if (this.playerType === 'youtube' && this.player) this.player.playVideo();
        if (this.playerType === 'soundcloud' && this.soundcloudPlayer) this.soundcloudPlayer.play();
      } else {
        if (this.playerType === 'youtube' && this.player) this.player.pauseVideo();
        if (this.playerType === 'soundcloud' && this.soundcloudPlayer) this.soundcloudPlayer.pause();
      }
    },
    currentSection(nV) {
      if (nV && (nV.content_type) && (nV.content_type === 'class')) {
        if (this.playerType === 'soundcloud') this.initializeSoundcloudPlayer();
      } else {
        // Destroy players
      }
    },
  },
  methods: {
    setLightboxMedia(media) {
      this.$store.commit(types.SET_LIGHTBOX_MEDIA, media);
    },
    change() {},
    initializeSoundcloudPlayer() {
      if (!this.soundcloudPlayer && this.src) {
        SoundCloud.initialize({
          client_id: config.SOUNCLOUD_CLIENT_ID,
        });
        SoundCloud.stream(this.src).then((player) => {
          this.soundcloudPlayer = player;
        });
      }
    },
    youtubeReady(player) {
      this.player = player;
      this.player.seekTo(this.currentTime);
    },
    youtubePlaying(player) {
      this.$store.commit(types.PLAY_VIDEO);
    },
    youtubeEnded() {
      this.$store.commit(types.PAUSE_VIDEO);
    },
    youtubePaused() {
      this.$store.commit(types.PAUSE_VIDEO);
    },
    youtubeSeek: _.throttle(function(self, position) {

      if (!self.player) { return; }

      const playerTime = self.player.getCurrentTime();
      if (!playerTime) { return; }
      const outOfSync = ((self.currentTime < (playerTime - SYNC_THRESHOLD))
      || (self.currentTime > (playerTime + SYNC_THRESHOLD)));

      if (outOfSync) {
        self.$log.info('Video out of sync - seeking');
        self.player.seekTo(position);
      }
    }, 500),
    soundcloudSeek: _.throttle(function (self, position) {

      if (!self.soundcloudPlayer) { return; }

      try {
        const playerTime = self.soundcloudPlayer.currentTime() / 1000;
        // self.$log.info(playerTime);
        // self.$log.info(self.currentTime);
        const outOfSync = ((self.currentTime < (playerTime - SYNC_THRESHOLD)) || (self.currentTime > (playerTime + SYNC_THRESHOLD)));

        if (outOfSync) {
          self.soundcloudPlayer.seek(position * 1000 + 300);
        }
      } catch (Exception) {
      }
    }, 500),
  },
  computed: {
    ...mapGetters([
      'course', 'currentClass', 'videoIsActive', 'videoEnabled', 'currentTime', 'currentSection', 'videoPlaying', 'media', 'currentSegment',
    ]),
    src() {
      switch (this.playerType) {
        case 'youtube':
          return (this.currentSection) ? this.currentSection.videoId : '';
          break;
        case 'soundcloud':
          return (this.currentSection) ? `/tracks/${this.currentSection.soundcloudId}` : '';
          break;
      }
    },
    mediaItems() {
      let mediaItems = [];

      if (this.media.length === 0) { return mediaItems; }

      let media = `https://${this.course.slug}.connectedacademy.io/course/content/en/${this.currentClass.dir}/transcripts/${this.media[0].text}`;

      for (var i = 0; i < this.media.length; i++) {
        const image = this.media[i];
        mediaItems.push(image.text);
      }

      return mediaItems;
    },
    currentSegmentIndex() {
      if (this.media.length === 0) { return 0; }

      let media = `https://${this.course.slug}.connectedacademy.io/course/content/en/${this.currentClass.dir}/transcripts/${this.media[0].text}`;

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
  padding 0 8px
  position relative
  height $media-height
  overflow-y scroll
  &.youtube-mode
    padding-left (188px / 0.5625) + 16px
  &.soundcloud-mode
    padding-left 38px + 16px
  #images-wrapper
    background white
    height ($media-height - 16px)
    overflow hidden
    padding 0
    position relative    
    .image-thumbnails
      overflow scroll
      height ($media-height - 16px)
      padding-left 280px
      .image-tile
        background-image()
        background-color $color-lightest-grey
        float left 
        margin 4px
        height calc(200px / 2)
        width calc(200px / 2)
        &:hover
          cursor pointer
    #image-current
      // background-color $color-light-grey
      border $color-border 1px solid
      border-box()
      height ($media-height - 16px)
      margin 0
      position absolute
      left 15px
      top 0
      width 260px
      .image-tile
        background-image()
        pinned()
        background-size contain
        position absolute
        &:hover
          cursor pointer

  #video-wrapper
    top 0
    bottom 0
    left 0
    right auto
    padding 16px
    position absolute
    #soundcloud-container
      height 188px
      width 40px
      img
        position absolute
        top 50%
        left 50%
        opacity 0.5
        transform translate(-50%, -60%) rotate(270deg)
    #video-container
      top 16px
      left 16px
      opacity 1
      box-sizing()
      overflow hidden

      iframe, object, embed, video
        position absolute !important
        top 0 !important
        bottom 0 !important
        left 0 !important
        right 0 !important

</style>
