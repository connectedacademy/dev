<template lang="pug">

.course-content

  .course-content--header
    svg(viewBox="0,0,320,320" style="overflow:visible;height:60px;width:60px")

      polyline(points="160 30 0 0 0 290 160 260" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:10px")

      polyline(points="160 30 320 0 320 290 160 260" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:10px")

      path(d="M160,30 l0,80Z" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:10px")

      path(d="M160,180 l0,80Z" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:10px")

    h1.content-title Homework

  .course-content--body
    p {{ content.description }}
    submission-button(v-bind:content="content")

  submission-grid(v-bind:content="content")

</template>

<script>
import _ from 'lodash';
import * as config from '@/api/config';
import {mapGetters} from 'vuex';
import Moment from 'moment';

import SubmissionGrid from '@/components/SubmissionGrid';
import SubmissionButton from '@/components/SubmissionButton';

export default {
  name: 'homework',
  props: ['content'],
  components: {
    SubmissionGrid,
    SubmissionButton,
  },
};
</script>

<style lang="stylus" scoped>
@import '~stylus/shared'
@import '~stylus/layout/course-content'

$color-homework = #FD3C51

.course-content
  background-color $color-homework !important
  overflow hidden
  position relative

  .course-content--header
    text-align center
    h1.content-title
      color white !important

  .course-content--body
    radius(6px)
    text-align center
    h1, h2, h5, p
      reset()
      color white
      padding 5px

</style>
