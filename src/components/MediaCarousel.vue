<template lang="pug">

.media-carousel-wrapper
  slick#image-swiper(ref="slick" v-bind:options="slickOptions")
    .img-wrapper(v-for="(item, key) in media" v-bind:key="key" )
      img(v-bind:data-lazy="`${course.baseUri}../media/small/${item.image}`")
      
</template>

<script>

import { mapGetters } from 'vuex'
import Slick from 'vue-slick'

require('slick-carousel/slick/slick.css')

export default {
  name: 'media-carousel',
  props: ['media'],
  components: {
    Slick
  },
  computed: {
    ...mapGetters(['course'])
  },
  data() {
    return {
      slickOptions: {
        autoplay: true,
        initialSlide: 3,
        autoplaySpeed: 3000,
        variableWidth: true,
        arrows: true,
        centerMode: true,
        slidesToShow: 1,
        fade: false,
        slidesToScroll: 1,
        infinite: true,
        swipe: true,
        nextArrow: '<button type="button" class="slick-next"><svg version="1.1" role="presentation" width="5.714285714285714" height="16" viewBox="0 0 640 1792" class="fa-icon"><path d="M595 960q0 13-10 23l-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23z"></path></svg></button>',
        prevArrow: '<button type="button" class="slick-prev"><svg version="1.1" role="presentation" width="5.714285714285714" height="16" viewBox="0 0 640 1792" class="fa-icon"><path d="M627 544q0 13-10 23l-393 393 393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23z"></path></svg></button>',
        lazyLoad: 'progressive'
      }
    }
  }
}

</script>

<style lang="stylus">

@import '~stylus/shared'

.media-carousel-wrapper
  .slick-slider
    button.slick-arrow
      animate()
      radius(22px)
      border none
      background $color-info
      color white
      height 44px
      margin-top -22px
      outline 0
      padding 0
      position absolute
      top 50%
      width 44px
      z-index 1
      &:hover
        cursor pointer
        background darken($color-info, 10%)
      svg
        height 30px
        fill white
      &.slick-prev
        left 8px
      &.slick-next
        right 8px

  .slick-track
    z-index 1
    position relative

    .slick-slide
      animate()
      outline 0
      img
        height 240px
        max-height 240px
        max-width 100%
        margin 0 10px
      // &:hover
      //   cursor pointer
      &.slick-current
        opacity 1
</style>
