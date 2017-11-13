<template lang="pug">

.course-content
  .course-content--header.block
    img(height="100px" src="../../assets/icons/certificate.svg")
    h1.content-title {{ content.title }}
    p.content-description {{ content.description }}
    router-link.pure-button(tag="a" v-bind:to="{ name: 'survey' }") View Survey

</template>

<script>
export default {
  name: 'survey',
  props: ['content'],
};
</script>

<style lang="stylus" scoped>

@import '~stylus/buttons'
@import '~stylus/layout/course-content'

.course-content
  position relative

  .course-content--header
    background-color $color-survey !important
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
      color $color-survey

</style>
