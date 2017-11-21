<template lang="pug">

.course-content(name="section-feedback")

  .course-content--header.block
    svg(viewBox="0,0,320,320" style="overflow:visible;height:60px;width:60px")

      polyline(points="160 30 0 0 0 290 160 260" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:10px")

      polyline(points="160 30 320 0 320 290 160 260" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:10px")

      path(d="M160,30 l0,80Z" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:10px")

      path(d="M160,180 l0,80Z" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:10px")

    h1.content-title {{ content.title }}
    p.content-description {{ content.description }}

    .submission-button-wrapper
      .pure-button(name="feedback-button" v-if="content.url" @click="openHomework")
        | {{ $t('common.participate') }}

</template>

<script>
import * as config from '@/api/config';
import {mapGetters} from 'vuex';
import Moment from 'moment-mini';

export default {
  name: 'homework',
  props: ['content'],
  methods: {
    openHomework() {
      this.$router.push(`/feedback/browse/${this.$store.getters.currentClass.slug}/${this.content.slug}`);
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/buttons'
@import '~stylus/layout/course-content'

.course-content
  background-color $color-homework !important
  overflow hidden
  position relative

  .course-content--header
    background-color $color-homework !important
    /*text-align center*/
    h1.content-title
      color white !important

    .submission-button-wrapper
      margin 10px auto 0 auto
      text-align center
      .pure-button
        background-color transparent
        border white 1px solid
        color white
        display inline-block
        margin 5px
        &:hover
          background-color white
          color $color-homework
</style>
