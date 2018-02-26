<template lang="pug">

.previous-button(@click="$emit('previousStep')")
  i.fas.fa-arrow-left

</template>

<script>

export default {
  name: 'previous-button'
}

</script>

<style lang="stylus" scoped>

@import '~stylus/registration'

.previous-button
  animate()
  display block
  color $color-lighter-grey
  padding 20px
  position absolute
  top 0
  left 0
  z-index 2
  svg
    height 20px
  &:hover
    cursor pointer
    color darken($color-lighter-grey, 10%)

</style>
