<template lang="pug">

  #media-wrapper
    
    #images-wrapper
      slick#image-swiper(v-if="liveclassMedia" ref="classslick" v-bind:options="slickOptions" v-on:afterChange="afterChange" v-on:swipe="interactionOccured")
        .img-wrapper(v-for="(item, index) in liveclassMedia" v-bind:key="index" )
          img(v-bind:data-lazy="imageUrl(item)" @click="setLightboxMedia(item)")
          #current Current

</template>

<script>
import Vue from 'vue'
import API from '@/api'
import { mapGetters } from 'vuex'
import { Events } from '@/events.js'

import _get from 'lodash/get'
import throttle from 'lodash/throttle'
import _inRange from 'lodash/inRange'

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
  beforeDestroy() {
    this.$store.commit('HIDE_MEDIA')
  },
  mounted() {
    Events.$on('scrollStatus', (scrollStatus) => {
      this.scrollStatus = scrollStatus
    })

    Vue.$log.info('Getting media...')

    this.getMedia()

    Events.$on('mediaUpdated', () => {
      this.getMedia()
    })
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
        centerMode: false,
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
    ...mapGetters(['CDN']),
    src () {
      return _get(this.content.videoId)
    },
  },
  methods: {
    getMedia() {
      API.message.getMedia(
        {
          theClass: this.currentClass.slug
        },
        (response) => {
          this.liveclassMedia = response
          if (this.liveclassMedia) {
            this.$store.commit('UPDATE_MEDIA', this.liveclassMedia)
            if (Object.keys(response).length > 0) {
              Events.$emit('mediaLoaded')
              this.$store.commit('SHOW_MEDIA')
            }
          }
        },
        (response) => {
          this.$log.error(response)
          this.$log.info('Failed to get media')
          this.liveclassMedia = undefined
        }
      )
    },
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
    imageUrl (item) {
      return item ? `https://d3duklpulopo9e.cloudfront.net/fit-in/300x200/${item.text}` : ''
    },
    setLightboxMedia(item) {
      if (!item) return
      this.$store.commit('SET_LIGHTBOX_MEDIA', `https://d3duklpulopo9e.cloudfront.net/fit-in/800x800/${item.text}`)
    },
    updateCarousel: throttle(function (self) {
      if (!self.scrollStatus) return
      if (!self.liveclassMedia ||  Object.keys(self.liveclassMedia).length == 0) return

      let media = Object.keys(self.liveclassMedia)
      let target = self.scrollStatus.currentSegmentGroup

      const closest = media.reduce(function(prev, curr) {
        return (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);
      })

      self.currentIndex = media.indexOf(closest)
      
      self.$refs.classslick.goTo(self.currentIndex)
    }, 500, { 'leading': false })
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
  outline 0
  position relative
  border-right white 10px solid
  img
    height ($media-height - $media-margin)
    max-height ($media-height - $media-margin)
    max-width 100%
  #current
    radius(5px)
    display none
    background $color-pink
    color white
    font-weight bold
    font-size 0.6em
    padding 3px 6px
    position absolute
    top 5px
    left 5px
  &.slick-current
    #current
      display block
  &:hover
    cursor pointer
</style>
