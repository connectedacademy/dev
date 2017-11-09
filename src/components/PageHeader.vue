<template lang="pug">
  .page-header(v-bind:class="identifier")
    h3.page-title(@click="previous")
      | {{ title }}
    slot
</template>

<script>
  import 'vue-awesome/icons/arrow-left'

  export default {
    name: 'page-header',
    props: ['title', 'identifier']
  }
</script>

<style lang="stylus" scoped>

  @import '~stylus/shared'

  .page-header
    pinned()
    border-top alpha(white, .1) 1px solid
    background-color $color-profile
    height $page-header-height
    padding 0 10px
    position fixed
    top $navigation-height
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
      right 10px
      z-index 10
</style>
