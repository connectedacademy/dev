<template lang="pug">
.previous-button(@click="$emit('previousStep')")
  icon(name="arrow-left")
</template>

<script>
import 'vue-awesome/icons/arrow-left'

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
  .fa-icon
    height 20px
  &:hover
    cursor pointer
    color darken($color-lighter-grey, 10%)

</style>
