<template lang="pug">

  .burger-menu(v-on:click="toggleLeftDrawer" v-bind:class="{ active: (state === 'close'), minimized: minimized }")
    transition(name="rotate")
      svg(v-bind:class="{cross:(state === 'close')}" viewBox="0 0 800 600")
        g
          path(d="M180,220 C300,220 520,220 540,220 C740,220 680,580 520,380 C440,300 300,160 300,160" id="top")
          path(d="M180,220 C300,220 520,220 540,220 C740,220 680,580 520,380 C440,300 300,160 300,160" id="bottom" transform="translate(480, 300) scale(1, -1) translate(-480, -300)")

</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'burger-menu',
  computed: {
    ...mapGetters([
      'navigation',
    ]),
  },
  methods: {
    toggleLeftDrawer() {
      this.$ga.event('burger-menu', 'click', 'left-drawer-toggled', true);
      this.$store.commit('TOGGLE_LEFT_DRAWER');
    },
  },
  computed: {
    state() {
      return this.$store.state.navigation.burger.state;
    },
    minimized() {
      return (this.$store.state.navigation && this.$store.state.navigation.minimized);
    },
  },
};

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.burger-menu
  radius(50%)
  transition(all 0.4s)
  background-color transparent
  height 50px
  width 52px

  position fixed
  top 5px
  left 5px
  z-index 52

  &:hover
    cursor pointer
    background-color darken($color-primary, 5%)

  &.minimized
    background-color $color-primary

  /* Active styles */
  &.active
    background-color transparent
    left calc(100% - 60px)
    z-index 52
    @media(min-width: 360px)
      left 300px

easeInOutSine = cubic-bezier(0.445, 0.050, 0.550, 0.950)
easeOutBack   = cubic-bezier(0.250,-0.250, 0.750, 1.250)
easing = easeInOutSine
duration = 0.8s

dash-offset-cross = 0px
cross-length = 800px

svg
  width 60px
  height 50px
  cursor pointer
  transform translate3d(0,0,0)

path
  fill none
  transition stroke-dashoffset duration easing, stroke-dasharray duration easing
  stroke-width 25px
  stroke-linecap round
  stroke white
  stroke-dashoffset 0px
  stroke-dasharray 320px cross-length

.cross
  path
    stroke-dashoffset -745px
</style>
