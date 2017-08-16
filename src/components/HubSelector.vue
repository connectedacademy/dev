<template lang="pug">

ul.hub-selector
  li.hub(v-for="hub in hubs" v-bind:class="{active: (hub.id === 'ams')}")
    h1.hub-name {{ hub.name }}
    h2.hub-timezone {{ hub.timezone }}
  .clearfix

</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'hub-selector',
  computed: {
    ...mapGetters([
      'course', 'hubs',
    ]),
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

ul.hub-selector
  cleanlist()
  margin 10px
  li.hub
    cleanlist()
    radius(6px)
    transition(background-color 0.3s linear)
    background-color alpha(white, 0.6)
    float left
    text-align center
    margin 10px
    padding 20px
    @media(max-width: 1600px)
      width calc((100% / 3) - 60px)
    @media(max-width: 768px)
      width calc(100% - 60px)
    h1.hub-name
      reset()
      color $color-primary
      font-size 1.3em
    h2.hub-timezone
      reset()
      color $color-primary
      font-size 1.1em
      &:hover
        cursor pointer
    &:hover, &.active
      background-color alpha(white, 1.0)
      cursor pointer

</style>
