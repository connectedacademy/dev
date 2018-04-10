<template lang="pug">

.page-header(v-bind:class="identifier")
  h3.page-title
    | {{ title }}
  slot

</template>

<script>
export default {
  name: 'page-header',
  props: ['title', 'identifier']
}

</script>

<style lang="stylus" scoped>

  @import '~stylus/shared'

  .page-header
    pinned()
    background-color $color-primary
    height $page-header-height
    padding 0 10px 0 40px
    position fixed
    top 0
    bottom auto
    z-index 2
    &.homework
      background-color $color-homework
    &.profile
      background-color $color-profile

    h3.page-title
      reset()
      color white
      line-height $page-header-height
      padding 0 10px
      whitespace nowrap

    .profile-class-selector
      position absolute
      top 0px
      right 60px
      z-index 10
</style>
