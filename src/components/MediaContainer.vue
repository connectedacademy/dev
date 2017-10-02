<template lang="pug">

  #media-wrapper(v-bind:class="{ 'soundcloud-mode': (playerType === 'soundcloud'), 'youtube-mode': (src && playerType === 'youtube') }")
    
    #stream-wrapper
      //- youtube#video-container(v-if="src && (playerType === 'youtube')" v-bind:video-id="src" v-bind:player-vars="{'autoplay': 1, 'controls': 0, 'playsinline': 1, 'rel': 0, 'showinfo': 0, 'modestbranding': 1}" @ready="youtubeReady" @playing="youtubePlaying" @paused="youtubePaused" @ended="youtubeEnded" v-bind:player-width="pWidth" v-bind:player-height="pHeight" v-bind:style="{ height: `${pHeight}px`, width: `${pWidth}px` }")
      #soundcloud-container(v-if="playerType === 'soundcloud'")
        img(src="../assets/icons/soundcloud.png")
    
    #images-wrapper
      img#current-image(v-if="!slickMode && currentIndex" v-bind:src="`https://${course.slug}.connectedacademy.io/course/content/media/small/${media[currentIndex].text}`" @click="setLightboxMedia(media[currentIndex].text)")
      //- img#next-image(v-if="!slickMode && nextIndex" v-bind:src="`https://${course.slug}.connectedacademy.io/course/content/media/small/${media[nextIndex].text}`" @click="setLightboxMedia(media[nextIndex].text)")
      slick#image-swiper(v-if="slickMode" ref="classslick" v-bind:options="slickOptions")
        .img-wrapper(v-for="(item, key) in media" v-bind:key="key" )
          img(v-bind:data-lazy="`https://${course.slug}.connectedacademy.io/course/content/media/small/${item.text}`" @click="setLightboxMedia(item.text)")

</template>

<script>
  import { mapGetters } from 'vuex';

  import throttle from 'lodash/throttle';
  import inRange from 'lodash/inRange';

  // import VueYouTubeEmbed from 'vue-youtube-embed';
  import Slick from 'vue-slick';
  
  require('slick-carousel/slick/slick.css');
  
  export default {
    name: 'media-container',
    props: ['playerType', 'content', 'videoIsActive'],
    components: {
      Slick,
      // VueYouTubeEmbed
    },
    watch: {
      '$media': {
        handler: function(nV, oV) {
          if (this.slickMode) {
            this.$refs.classslick.reSlick();
          }
        },
        deep: true,
      },
      currentTime(nV, oV) {
        this.updateCarousel(this);
      },
      videoIsActive(nV) {
        if (this.slickMode) {
          this.$refs.classslick.reSlick();
        }
      },
    },
    data() {
      return {
        slickMode: true,
        currentIndex: 0,
        nextIndex: 1,
        lightboxVisible: false,
        lightboxImage: undefined,
        pHeight: 188,
        pWidth: (188 / 0.5625),
        slickOptions: {
          initialSlide: 0,
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
          lazyLoad: 'ondemand',
        },
      };
    },
    computed: {
      ...mapGetters([
        'course', 'currentTime', 'media'
      ]),
      src() {
        if (this.playerType === 'soundcloud') {
          return (this.content) ? this.content.videoId : '';
        }
      },
    },
    methods: {
      setLightboxMedia(media) {
        this.$store.commit('SET_LIGHTBOX_MEDIA', media);
      },
      // youtubeReady(player) {
      //   this.player = player;
      //   this.player.seekTo(this.currentTime);
      // },
      // youtubePlaying(player) {
      //   this.$store.commit('PLAY_MEDIA');
      // },
      // youtubeEnded() {
      //   this.$store.commit('PAUSE_MEDIA');
      // },
      // youtubePaused() {
      //   this.$store.commit('PAUSE_MEDIA');
      // },
      // youtubeSeek: throttle(function(self, position) {
  
      //   if (!self.player) {
      //     return;
      //   }
  
      //   const playerTime = self.player.getCurrentTime();
      //   if (!playerTime) {
      //     return;
      //   }
      //   const outOfSync = ((self.currentTime < (playerTime - SYNC_THRESHOLD)) ||
      //     (self.currentTime > (playerTime + SYNC_THRESHOLD)));
  
      //   if (outOfSync) {
      //     self.$log.info('Video out of sync - seeking');
      //     self.player.seekTo(position);
      //   }
      // }, 500),
      updateCarousel: throttle(function(self) {
        for (let i = 0; i < self.media.length; i++) {
          const image = self.media[i];
  
          if (inRange(self.currentTime, image.start, image.end)) {
            if (self.slickMode) {
              self.$refs.classslick.goTo(i);
            }
            self.currentIndex = i;
            self.nextIndex = (i < self.media.length) ? (i + 1) : undefined;
            
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
    padding-left 55px
  #images-wrapper
    background white
    height ($media-height - 16px)
    overflow hidden
    padding 0
    position relative    
    img#current-image, img#next-image
      height 204px
      margin-right 20px
      &:hover
        cursor pointer
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

  #stream-wrapper
    top 0
    bottom 0
    left 0
    right auto
    padding 10px
    position absolute
    #soundcloud-container
      height 188px
      width 34px
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

  .slick-slide
    opacity 0.5
    outline 0
    img
      height 204px
      max-height 204px
      max-width 100%
      margin 0 10px
    &:hover
      cursor pointer
    &.slick-current
      opacity 1
</style>
