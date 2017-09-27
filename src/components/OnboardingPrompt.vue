<template lang="pug">
  .onnboarding-prompt
    | {{ prompt }}
</template>

<script>
export default {
  name: 'onnboarding-prompt',
  props: ['prompt', 'selector'],
  mounted() {
    this.selector
    this.o
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.onnboarding-prompt
  radius(6px)
  box-shadow()
  background-color #1b6ff1
  color white
  position absolute
  top 50px
  left -100px
  padding 10px 20px
  z-index 49
  text-transform uppercase
  font-weight bold
  font-size 0.8em
  &:after
    content ''
    background-color #1b6ff1
    position absolute
    top -10px
    height 10px
    width 4px
    margin-left -2px
    left 50%
    z-index 49
  &:before
    radius(50%)
    content ''
    background-color #1b6ff1
    height 16px
    width 16px
    position absolute
    top -26px
    margin-left -8px
    left 50%
    z-index 49

</style>
