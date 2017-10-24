<template lang="pug">

  .profile-panel--header
    h1 {{ label }}

    .profile-panel--header--actions
      .action-button.reload-button(v-if="canRefresh" @click="refresh")
        icon(name="refresh")

      .action-button.expand-button(v-if="canExpand" @click="expand")
        icon(name="expand")

      .clearfix

</template>

<script>

import 'vue-awesome/icons/refresh';
import 'vue-awesome/icons/expand';

export default {
  name: 'profile-panel-header',
  props: ['label', 'canRefresh', 'canExpand'],
  methods: {
    expand() {
      this.$emit('expand');
    },
    refresh() {
      this.$emit('refresh');
    },
  },
}

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.profile-panel--header
  border-bottom $color-lightest-grey 3px solid
  height 60px
  padding-right 40px
  position absolute
  top 0
  left 0
  right 0
  white-space nowrap
  overflow hidden
  .profile-panel--header--actions
    height 60px
    position absolute
    top 0
    right 0
    
    .action-button
      animate()
      color $color-grey
      float right
      height 60px
      width 40px
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