<template lang="pug">

  .mock-message(v-bind:class="{ loading: loading }")
    .mock-message--user
    .mock-message--body
      .mock-message--line
      .mock-message--line
      .mock-message--line

</template>

<script>
export default {
  name: 'mock-message',
  props: ['loading'],
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.mock-message
  height 140px
  padding-left 60px
  top 0
  left 0
  right 30px
  .mock-message--user
    radius(50%)
    height 40px
    width 40px
    position absolute
    top 20px
    left 15px
  .mock-message--body
    radius(6px)
    height 100px
    padding 10px
    .mock-message--line
      radius(6px)
      height 20px
      margin-top 15px
      &:first-child
        max-width 100px
  .mock-message--user, .mock-message--line
    animate()
    background-color $color-lighter-grey

  &.loading
    .mock-message--user, .mock-message--line
      // animation pulse 2s infinite
      background-color lighten($color-lighter-grey, 70%)

@-webkit-keyframes pulse
  0%
    background-color $color-lighter-grey
  50%
    background-color lighten($color-lighter-grey, 50%)
  100%
    background-color $color-lighter-grey

@keyframes pulse
  0%
    background-color $color-lighter-grey
  50%
    background-color lighten($color-lighter-grey, 50%)
  100%
    background-color $color-lighter-grey

</style>
