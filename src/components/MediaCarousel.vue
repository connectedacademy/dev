<template lang="pug">
.media-carousel-wrapper
  slick#image-swiper(ref="slick" v-bind:options="slickOptions")
    img(v-for="(item, key) in media" v-bind:key="key" height="200px" v-bind:src="`https://${course.slug}.connectedacademy.io/course/content/media/small/${item.image}`")

</template>

<script>
import { mapGetters } from 'vuex';
import Slick from 'vue-slick';

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
        lazyLoaded: true,
        arrows: false,
        centerMode: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        swipe: true,
      },
    }
  },
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.slick-track
  z-index 1
  position relative

  img.slick-slide
    margin 0 10px
    outline 0
    height 320px
</style>
