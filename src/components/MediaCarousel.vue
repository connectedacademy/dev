<template lang="pug">
.media-carousel-wrapper
  swiper(v-bind:options="swiperOption")
    swiper-slide(v-for="(item, key) in media" v-bind:key="key")
      img.swiper-lazy(v-bind:data-src="`https://${course.slug}.connectedacademy.io/course/content/media/${item.image}`")
      .swiper-lazy-preloader.swiper-lazy-preloader-white
    //- .swiper-pagination(slot="pagination")
    .swiper-button-prev(slot="button-prev")
    .swiper-button-next(slot="button-next")
</template>

<script>
import { mapGetters } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'media-carousel',
  props: ['media'],
  components: {
    swiper,
    swiperSlide
  },
  computed: {
    ...mapGetters(['course'])
  },
  data() {
    return {
      swiperOption: {
        pagination: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 0,
        loop: true,
        paginationClickable: true,
        preloadImages: false,
        lazyLoading: true
      },
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

// Swiper
.swiper-slide
  background-image()
  background-size contain
  background-color #222
  margin 10px auto
  min-height 400px
.swiper-slide img
  width auto
  height auto
  max-width 100%
  max-height 100%
  -ms-transform translate(-50%, -50%)
  -webkit-transform translate(-50%, -50%)
  -moz-transform translate(-50%, -50%)
  transform translate(-50%, -50%)
  position absolute
  left 50%
  top 50%
</style>
