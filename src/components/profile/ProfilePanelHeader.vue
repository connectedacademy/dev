<template lang="pug">

  .profile-panel--header
    h1 {{ label }}

    .reload-button(@click="refresh")
      icon(name="refresh")

</template>

<script>

import 'vue-awesome/icons/refresh';

export default {
  name: 'profile-panel-header',
  props: ['label'],
  methods: {
    refresh() {
      this.$emit('refresh');
    },
  },
}

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.profile-panel--header
  background-color white
  border-bottom $color-lightest-grey 3px solid
  height 60px
  padding-right 40px
  position absolute
  top 0
  left 0
  right 0
  white-space nowrap
  overflow hidden
  .reload-button
    animate()
    color $color-grey
    height 60px
    width 40px
    position absolute
    right 0px
    top 0px
    text-align center
    .fa-icon
      height 60px
      width 15px
    &:hover
      color darken($color-grey, 20%)
      cursor pointer
  h1
    reset()
    color $color-text-grey
    font-size 1.2em
    line-height 60px
    padding 0 20px
  </style>