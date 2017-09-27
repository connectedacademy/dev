<template lang="pug">

  #media-wrapper(v-bind:class="{ 'soundcloud-mode': (src && playerType === 'soundcloud'), 'youtube-mode': (src && playerType === 'youtube') }")

    #stream-wrapper
      youtube#video-container(v-if="src && (this.playerType === 'youtube')" v-bind:video-id="src" v-bind:player-vars="{'autoplay': 1, 'controls': 0, 'playsinline': 1, 'rel': 0, 'showinfo': 0, 'modestbranding': 1}" @ready="youtubeReady" @playing="youtubePlaying" @paused="youtubePaused" @ended="youtubeEnded" v-bind:player-width="pWidth" v-bind:player-height="pHeight" v-bind:style="{ height: `${this.pHeight}px`, width: `${this.pWidth}px` }")
      #soundcloud-container(v-if="src && (this.playerType === 'soundcloud')")
        img(src="../assets/icons/soundcloud.png")
    
    #images-wrapper
      //- #mobile-image-view(v-if="media[savedSegmentIndex]" v-bind:style="{ 'background-image': `url(https://${course.slug}.connectedacademy.io/course/content/media/small/${media[savedSegmentIndex].text})` }" @click="setLightboxMedia(media[savedSegmentIndex].text)")

      slick#image-swiper(ref="classslick" v-bind:options="slickOptions")
        img(v-for="(item, key) in media" v-bind:key="key" v-bind:data-lazy="`https://${course.slug}.connectedacademy.io/course/content/media/small/${item.text}`" @click="setLightboxMedia(item.text)")

</template>

<script>
  const SYNC_THRESHOLD = 2.0;
  
  import SoundCloud from 'soundcloud';
  import VueYouTubeEmbed from 'vue-youtube-embed';
  import Slick from 'vue-slick';
  
  import * as config from '@/api/config';
  import throttle from 'lodash/throttle';
  import inRange from 'lodash/inRange';
  
  require('slick-carousel/slick/slick.css');
  
  import {
    mapGetters
  } from 'vuex';
  
  export default {
    name: 'media-container',
    props: ['playerType', 'classSection', 'videoIsActive'],
    components: {
      Slick,
      VueYouTubeEmbed
    },
    mounted() {
      setTimeout(() => {
        this.initializeSoundcloudPlayer();
      }, 2500);
    },
    beforeDestroy() {
      // Remove event listeners
      this.soundcloudPlayer = undefined;
    },
    watch: {
      pendingScrollPosition(nV) {
        // this.$log.info(this.pendingScrollPosition);
        if (nV === 0) return;

        const scrollPoint = this.$store.state.scrollPoints[this.classSection.slug];
        this.$store.commit('setPendingScrollPosition', 0);
        
        window.scroll(0, scrollPoint.top + ((nV * 0.2) * 158.0));

        setTimeout(() => {
          this.soundcloudPlayer.seek(nV * 1000);          
        }, 300);
      },
      '$media': {
        handler: function(nV, oV) {
          this.reInit();
        },
        deep: true,
      },
      currentTime(nV, oV) {
        this.updateCarousel(this);
        // if (this.playerType === 'youtube' && this.player) this.youtubeSeek(this, nV);
        // if (this.playerType === 'soundcloud' && this.soundcloudPlayer) this.soundcloudSeek(this, nV);
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
      videoIsActive(nV) {
        this.reInit();
        if (!nV) {
          this.$store.commit('PAUSE_MEDIA');
        }
      },
      activeSegment(nV) {
        if (nV) {
          this.$store.commit('PAUSE_MEDIA');
        }
      },
      peekSegment(nV) {
        if (nV) {
          this.$store.commit('PAUSE_MEDIA');
        }
      }
    },
    data() {
      return {
        lightboxVisible: false,
        lightboxImage: undefined,
        soundcloudPlayer: undefined,
        pHeight: 188,
        pWidth: (188 / 0.5625),
        isMobile: false,
        savedSegmentIndex: 0,
        slickOptions: {
          arrows: false,
          centerMode: false,
          slidesToShow: 3,
          slidesToScroll: 1,
          variableWidth: true,
          infinite: false,
          swipe: false,
          swipeToSlide: false,
          touchMove: false,
          draggable: false,
          useTransform: true,
          useCSS: true,
          lazyLoad: 'progressive',
        },
      };
    },
    computed: {
      ...mapGetters([
        'course', 'currentTime', 'videoPlaying', 'media', 'pendingScrollPosition', 'peekSegment'
      ]),
      src() {
        switch (this.playerType) {
          case 'youtube':
            return (this.classSection) ? this.classSection.videoId : '';
            break;
          case 'soundcloud':
            return (this.classSection) ? `/tracks/${this.classSection.soundcloudId}` : '';
            break;
        }
      },
    },
    methods: {
      reInit() {
        this.$refs.classslick.reSlick();
      },
      setLightboxMedia(media) {
        this.$store.commit('SET_LIGHTBOX_MEDIA', media);
      },
      change() {},
      initializeSoundcloudPlayer() {
        this.$log.info('initializeSoundcloudPlayer');
        if (!this.soundcloudPlayer && this.src) {
          SoundCloud.initialize({
            client_id: config.SOUNCLOUD_CLIENT_ID,
          });
          SoundCloud.stream(this.src).then((player) => {
            this.soundcloudPlayer = player;
            this.soundcloudPlayer.on('time', () => {
              this.performSync(this);
            });
            this.soundcloudPlayer.on('seeked', () => {
              this.performSeeked(this);
            });
          });
        }
      },
      youtubeReady(player) {
        this.player = player;
        this.player.seekTo(this.currentTime);
      },
      youtubePlaying(player) {
        this.$store.commit('PLAY_MEDIA');
      },
      youtubeEnded() {
        this.$store.commit('PAUSE_MEDIA');
      },
      youtubePaused() {
        this.$store.commit('PAUSE_MEDIA');
      },
      youtubeSeek: throttle(function(self, position) {
  
        if (!self.player) {
          return;
        }
  
        const playerTime = self.player.getCurrentTime();
        if (!playerTime) {
          return;
        }
        const outOfSync = ((self.currentTime < (playerTime - SYNC_THRESHOLD)) ||
          (self.currentTime > (playerTime + SYNC_THRESHOLD)));
  
        if (outOfSync) {
          self.$log.info('Video out of sync - seeking');
          self.player.seekTo(position);
        }
      }, 500),
      performSync: throttle(function(self) {
        self.$log.info('time');
        if (!self.soundcloudPlayer) return;

        const currentTime = self.currentTime;
        if (!currentTime || !self.videoIsActive) {
          self.$store.commit('PAUSE_MEDIA');
          return;
        }
        const playerTime = self.soundcloudPlayer.currentTime() / 1000;
        const outOfSync = ((currentTime < (playerTime - SYNC_THRESHOLD)) || (currentTime > (playerTime + SYNC_THRESHOLD)));

        if (outOfSync) {
          self.$log.info('OUTOFSYNC');
          self.soundcloudPlayer.seek(currentTime * 1000);
        }

      }, 1000),
      performSeeked: throttle(function(self) {
        this.$log.info('seeked');
        setTimeout(() => {
          if (!(this.peekSegment || this.activeSegment)) {
            this.$store.commit('PLAY_MEDIA');
          }
        }, 500);
      }, 1000),
      updateCarousel: throttle(function(self) {
        for (let i = 0; i < self.media.length; i++) {
          const image = self.media[i];
  
          if (inRange(self.currentTime, image.start, image.end)) {
            self.savedSegmentIndex = i;
            self.$refs.classslick.goTo(i);
          }
        }
      }, 1000),
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
  overflow hidden
  &.youtube-mode
    padding-left (188px / 0.5625) + 16px
  &.soundcloud-mode
    padding-left 38px + 30px
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
    .swiper-container
      display block
      @media(max-width: 568px)
        display none
    #mobile-image-view
      background-image()
      background-size contain
      pinned()
      position absolute
      display none
      @media(max-width: 568px)
        display block

  #stream-wrapper
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


.slick-track
  z-index 1
  position relative

  img.slick-slide
    height 204px
    max-height 204px
    max-width 100%
    margin 0 10px
    opacity 0.3
    outline 0
    &:hover
      cursor pointer
    &.slick-current
      opacity 1
</style>
