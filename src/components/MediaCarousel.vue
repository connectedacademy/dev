<template lang="pug">
.media-carousel-wrapper
  slick#image-swiper(ref="slick" v-bind:options="slickOptions")
    .img-wrapper(v-for="(item, key) in media" v-bind:key="key" )
      img(v-bind:data-lazy="`https://${course.slug}.connectedacademy.io/course/content/media/small/${item.image}`")
      
</template>

<script>
import { mapGetters } from 'vuex';
import Slick from 'vue-slick';

import 'vue-awesome/icons/angle-left';
import 'vue-awesome/icons/angle-right';

require('slick-carousel/slick/slick.css');

export default {
  name: 'media-carousel',
  props: ['media'],
  components: {
    Slick,
  },
  computed: {
    ...mapGetters(['course'])
  },
  data() {
    return {
      slickOptions: {
        variableWidth: true,
        arrows: true,
        centerMode: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        swipe: true,
        nextArrow: '<button type="button" class="slick-next"><svg version="1.1" role="presentation" width="5.714285714285714" height="16" viewBox="0 0 640 1792" class="fa-icon"><path d="M595 960q0 13-10 23l-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23z"></path></svg></button>',
        prevArrow: '<button type="button" class="slick-prev"><svg version="1.1" role="presentation" width="5.714285714285714" height="16" viewBox="0 0 640 1792" class="fa-icon"><path d="M627 544q0 13-10 23l-393 393 393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23z"></path></svg></button>',
        lazyLoad: 'progressive',
      },
    }
  },
}
</script>

<style lang="stylus">

@import '~stylus/shared'

.slick-slider
  button.slick-arrow
    animate()
    radius(4px)
    border none
    background alpha(black, 0.4)
    margin-top -46px
    outline 0
    padding 30px 15px
    position absolute
    top 50%
    z-index 1
    &:hover
      cursor pointer
      background alpha(black, 0.8)
    .fa-icon
      height 30px
      color white
    &.slick-prev
      left 10px
    &.slick-next
      right 10px

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

.slick-track
  z-index 1
  position relative

  .slick-slide
    opacity 0.5
    outline 0
    img
      height 300px  
      max-height 300px  
      max-width 100%
      margin 0 10px
    &:hover
      cursor pointer
    &.slick-current
      opacity 1
</style>
