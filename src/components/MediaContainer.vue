<template lang="pug">

  #media-wrapper
    
    #images-wrapper
      slick#image-swiper(v-if="liveclassMedia" ref="classslick" v-bind:options="slickOptions" v-on:afterChange="afterChange" v-on:swipe="interactionOccured")
        .img-wrapper(v-for="(item, index) in liveclassMedia" v-bind:key="index" )
          img(v-bind:data-lazy="`${course.baseUri}../media/small/${item.text}`" @click="setLightboxMedia(index)")

</template>

<script>
import Vue from 'vue'
import API from '@/api'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

import _get from 'lodash/get'
import throttle from 'lodash/throttle'
import inRange from 'lodash/inRange'

// import VueYouTubeEmbed from 'vue-youtube-embed'
import Slick from 'vue-slick'

require('slick-carousel/slick/slick.css')

export default {
  name: 'media-container',
  props: ['currentClass', 'content'],
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

        if (typeof this.$refs.classslick !== 'undefined') {
          this.$refs.classslick.reSlick()
        }
        else {
          this.$log.info('Slick ref does not exist')
        }
      },
      deep: true,
    },
    scrollStatus(nV, oV) {
      if (this.userInteracting) return
      this.updateCarousel(this)
    }
  },
  data() {
    return {
      interactionTimer: undefined,
      userInteracting: false,
      liveclassMedia: undefined,
      scrollStatus: undefined,
      currentIndex: 0,
      nextIndex: 1,
      lightboxVisible: false,
      lightboxImage: undefined,
      pHeight: 188,
      pWidth: (188 / 0.5625),
      slickOptions: {
        initialSlide: 0,
        arrows: false,
        centerMode: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        focusOnSelect: true,
        variableWidth: true,
        infinite: false,
        swipe: true,
        swipeToSlide: true,
        // touchMove: false,
        draggable: true,
        useTransform: true,
        useCSS: true,
        lazyLoad: 'ondemand'
      }
    }
  },
  computed: {
    ...mapGetters(['course']),
    src () {
      return _get(this.content.videoId)
    },
  },
  methods: {
    afterChange(event, slick, currentSlide) {
      this.currentIndex = currentSlide
    },
    reslick() {
      this.$nextTick(() => {
        this.$refs.classslick.reSlick()
      })
    },
    interactionOccured() {
      this.userInteracting = true
      clearTimeout(this.interactionTimer)
      this.interactionTimer = setTimeout(() => {
        this.userInteracting = false
      }, 10000)
    },
    setLightboxMedia(index) {
      const media = this.liveclassMedia[index]
      if (index === this.currentIndex) {
        this.$store.commit('SET_LIGHTBOX_MEDIA', media.text)
      }
    },
    updateCarousel: throttle(function (self) {
      if (!self.scrollStatus) return
      if (!self.liveclassMedia) return

      for (let i = 0; i < self.liveclassMedia.length; i++) {
        const image = self.liveclassMedia[i]

        if (inRange(self.scrollStatus.currentTime, image.start, image.end)) {
          self.$refs.classslick.goTo(i)
          self.currentIndex = i
          self.nextIndex = (i < self.liveclassMedia.length) ? (i + 1) : undefined
          
        }
      }
    }, 300, { 'leading': false })
  }
}
</script>

<style lang="stylus">

@import '~stylus/shared'

#media-wrapper
  background-color $color-lightest-grey
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
    height ($media-height - $media-margin)
    max-height ($media-height - $media-margin)
    max-width 100%
    // margin 5px 5px 10px 5px
  &:hover
    cursor pointer
  &.slick-current
    opacity 1
</style>
