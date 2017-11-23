<template lang="pug">

  .navigation-button(v-if="isVisible" name="navigation-button" v-on:click="toggleLeftDrawer" v-bind:class="{ active: (state === 'close'), back: !isRoot }")
    .bar-wrapper(v-bind:class="{cross: (state === 'close') }")
      .bar.top-bar
      .bar.middle-bar
      .bar.bottom-bar

</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'navigation-button',
  computed: {
    ...mapGetters([
      'navigation',
    ]),
  },
  methods: {
    toggleLeftDrawer() {
      if (this.isRoot) {
        this.$ga.event('navigation-button', 'clicked', 1)
        this.$store.commit('TOGGLE_LEFT_DRAWER')
      }
      else {
        this.$router.go(-1)
      }
    }
  },
  computed: {
    state() {
      return this.$store.state.navigation.burger.state
    },
    isVisible() {
      return this.$store.state.navigation.visible
    },
    isRoot() {
      const paths = ['class', 'schedule', 'home', 'about']
      return paths.indexOf(this.$route.name) !== -1
    }
  }
}

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.navigation-button
  animate()
  radius(50%)
  height 50px
  width 52px

  position fixed
  top 0
  left 0
  z-index 55

  .bar-wrapper
    pinned()
    position absolute
    .bar
      animate()
      pinned()
      background-color white
      height 2px
      left 12px 
      right 12px
      position absolute
      &.top-bar
        top 16px
        bottom auto
      &.bottom-bar
        bottom 16px
        top auto
      &.middle-bar
        left 12px 
        right 16px
        bottom 24px
        top auto

  &.back
    .bar-wrapper
      pinned()
      position absolute
      .bar
        pinned()
        transition-delay 0.5s
        background-color white
        height 2px
        left 12px 
        right 12px
        position absolute
        &.top-bar
          top 19px
          right 26px        
          bottom auto
          transform rotate(-45deg)
        &.bottom-bar
          bottom 19px
          right 26px        
          top auto
          transform rotate(45deg) 
        &.middle-bar
          bottom 24px
          left 13px 
          right 10px
          top auto

      &:hover
        .bar-wrapper
          .middle-bar
            left 13px
            right 8px


  &:hover
    cursor pointer

  /* Active styles */
  &.active
    background-color transparent
    left calc(100% - 60px)
    z-index 56
    @media(min-width: 360px)
      left 310px
  
  .bar-wrapper
    &.cross
      .bar
        left 12px !important
        right 12px !important
      .top-bar
        top 24px !important
        transform rotate(-45deg)
      .bottom-bar
        bottom 24px !important
        transform rotate(45deg)
      .middle-bar
        opacity 0

</style>