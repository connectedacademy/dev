<template lang="pug">

  .mock-message(v-bind:class="{ loading: loading }")
    .mock-message--user
    .mock-message--body
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
  right 50px
  .mock-message--user
    radius(50%)
    height 40px
    width 40px
    position absolute
    top 40px
    left 15px
  .mock-message--body
    radius(6px)
    height 80px
    padding 30px 10px
    .mock-message--line
      radius(10px)
      height 20px
      margin 15px 0
      &:first-child
        max-width 50%
      &:last-child
        max-width 75%
  .mock-message--user, .mock-message--line
    animate()
    background-color $color-lightest-grey

  &.loading
    .mock-message--user, .mock-message--line
      // animation pulse 2s infinite
      background-color lighten($color-lightest-grey, 20%)

@-webkit-keyframes pulse
  0%
    background-color lighten($color-lightest-grey, 20%)
  50%
    background-color $color-lightest-grey
  100%
    background-color lighten($color-lightest-grey, 20%)

@keyframes pulse
  0%
    background-color lighten($color-lightest-grey, 20%)
  50%
    background-color $color-lightest-grey
  100%
    background-color lighten($color-lightest-grey, 20%)

</style>
