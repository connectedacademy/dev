<template lang="pug">

.course-content
  .course-content--header.block
    h1.content-title {{ content.title }}
    p.content-description {{ content.description }}
    a.pure-button(href="https://twitter.com") Get in Touch

</template>

<script>
export default {
  name: 'next-class',
  props: ['content'],
};
</script>

<style lang="stylus" scoped>
@import '~stylus/shared'
@import '~stylus/layout/course-content'

.course-content
  position relative

  .course-content--header
    background-color $color-darkest-grey !important
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

  .pure-button
    background-color transparent
    border white 1px solid
    color white
    margin 20px auto 5px auto
    &:hover
      background-color white
      color $color-darkest-grey

</style>
