<template lang="pug">

.course-content

  .course-content--header.block
    h1.content-title {{ title }}
    h2.content-subtitle {{ subtitle }}

</template>

<script>
import Moment from 'moment-mini';

export default {
  name: 'future-content',
  props: ['title', 'subtitle']
};
</script>

<style lang="stylus" scoped>

@import '~stylus/layout/course-content'

.course-content
  position relative

  .course-content--header
    background-color $color-warning !important
    text-align center
    h1.content-title
      color white
      text-transform capitalize
    h2.content-subtitle
      color white
      font-weight normal

  .course-content--body
    background-color transparent
    padding 20px 40px !important
    text-align center
    h1, h2, h5
      reset()
      color white
      padding 5px
    h5
      opacity 0.5

</style>
