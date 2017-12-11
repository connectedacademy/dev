<template lang="pug">

  #media-wrapper(v-bind:class="{ 'youtube-mode': (src && playerType === 'youtube') }")
    
    #stream-wrapper
      //- youtube#video-container(v-if="src && (playerType === 'youtube')" v-bind:video-id="src" v-bind:player-vars="{'autoplay': 1, 'controls': 0, 'playsinline': 1, 'rel': 0, 'showinfo': 0, 'modestbranding': 1}" @ready="youtubeReady" @playing="youtubePlaying" @paused="youtubePaused" @ended="youtubeEnded" v-bind:player-width="pWidth" v-bind:player-height="pHeight" v-bind:style="{ height: `${pHeight}px`, width: `${pWidth}px` }")
    
    #images-wrapper
      slick#image-swiper(v-if="slickMode && liveclassMedia" ref="classslick" v-bind:options="slickOptions")
        .img-wrapper(v-for="(item, index) in liveclassMedia" v-bind:key="index" )
          img(v-bind:data-lazy="`${course.baseUri}../media/small/${item.text}`" @click="setLightboxMedia(item.text)")

</template>

<script>
import Vue from 'vue'
import API from '@/api'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

import throttle from 'lodash/throttle'
import inRange from 'lodash/inRange'

// import VueYouTubeEmbed from 'vue-youtube-embed'
import Slick from 'vue-slick'

require('slick-carousel/slick/slick.css')

export default {
  name: 'media-container',
  props: ['currentClass', 'playerType', 'content'],
  components: {
    Slick
    // VueYouTubeEmbed
  },
  mounted() {
    EventBus.$on('scrollStatus', (scrollStatus) => {
      this.scrollStatus = scrollStatus
    })

    if (typeof this.content.images === 'undefined') return
    Vue.$log.info('Getting media...')
    const mediaPath = `${this.course.baseUri}${this.currentClass.dir}/${this.content.images}`

    API.message.getMedia(
      this.content.slug,
      mediaPath,
      (response) => {
        this.liveclassMedia = response.response
      },
      (response) => {
        this.$log.error(response)
        this.$log.info('Failed to get media')
        this.liveclassMedia = undefined
      }
    )
  },
  watch: {
    'liveclassMedia': {
      handler: function(nV, oV) {
        if (typeof nV === 'undefined') return

        if (this.slickMode && (typeof this.$refs.classslick !== 'undefined')) {
          this.$refs.classslick.reSlick()
        }
        else {
          this.$log.info('Either slick ref does not exist or not in slick mode')
        }
      },
      deep: true,
    },
    scrollStatus(nV, oV) {
      this.updateCarousel(this)
    }
  },
  data() {
    return {
      liveclassMedia: undefined,
      scrollStatus: undefined,
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
        slidesToShow: 5,
        slidesToScroll: 1,
        variableWidth: true,
        infinite: false,
        swipe: false,
        swipeToSlide: false,
        touchMove: false,
        draggable: false,
        useTransform: true,
        useCSS: true,
        lazyLoad: 'ondemand'
      }
    }
  },
  computed: {
    ...mapGetters(['course']),
    src() {
      if (this.playerType === 'soundcloud') {
        return (this.content) ? this.content.videoId : ''
      }
    },
  },
  methods: {
    reslick() {
      this.$nextTick(() => {
        this.$refs.classslick.reSlick()
      })
    },
    setLightboxMedia(media) {
      this.$store.commit('SET_LIGHTBOX_MEDIA', media)
    },
    updateCarousel: throttle(function (self) {
      if (!self.scrollStatus) return
      if (!self.liveclassMedia) return

      for (let i = 0; i < self.liveclassMedia.length; i++) {
        const image = self.liveclassMedia[i]

        if (inRange(self.scrollStatus.currentTime, image.start, image.end)) {
          if (self.slickMode) {
            self.$refs.classslick.goTo(i)
          }
          self.currentIndex = i
          self.nextIndex = (i < self.liveclassMedia.length) ? (i + 1) : undefined
          
        }
      }
    }, 300, { 'leading': false })
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

#media-wrapper
  position relative
  height $media-height
  overflow hidden
  &.youtube-mode
    padding-left (188px / 0.5625) + 16px

  #stream-wrapper
    top 0
    bottom 0
    left 0
    right auto
    padding 10px
    position absolute
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
      height ($media-height - 15px)
      max-height ($media-height - 15px)
      max-width 100%
      margin 5px 5px 10px 5px
    &:hover
      cursor pointer
    &.slick-current
      opacity 1
</style>
