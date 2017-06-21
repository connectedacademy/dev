<template lang="pug">

  .mock-message(v-bind:class="{ loading: message.loading }" hidden)
    .mock-message--user
    .mock-message--body
      .mock-message--line
      .mock-message--line
      .mock-message--line

</template>

<script>
export default {
  name: 'mock-message',
  props: ['message'],
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.mock-message
  /*animate()*/
  height 140px
  padding-left 60px
  position absolute
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
    background-color $color-lighter-grey
    animate()
  &.loading
    .mock-message--user, .mock-message--line
      background-color lighten($color-lighter-grey, 10%)

</style>
