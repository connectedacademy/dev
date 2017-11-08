<template lang="pug">

.four-corners-link
  .four-corners-link--body
    img(src="../../assets/logos/fourcorners/black.svg")
  .four-corners-link--footer
    p {{ message }}
    router-link.pure-button.pure-button-subtle.pull-right(to="/fourcorners") Learn More
    .clearfix

</template>

<script>
export default {
  name: 'four-corners-link',
  props: ['message']
};
</script>

<style lang="stylus">

@import '~stylus/shared'
@import '~stylus/buttons'

.four-corners-link
  radius(6px)
  background-color white
  border $color-border 1px solid
  overflow hidden
  margin 20px 0
  .four-corners-link--body
    border-bottom $color-border 1px solid
    height 32px
    padding 10px
    img
      height 32px
  .four-corners-link--footer
    padding 15px
    h1, p
      color black
    p
      reset()
      padding 0px 0 20px 0
</style>
