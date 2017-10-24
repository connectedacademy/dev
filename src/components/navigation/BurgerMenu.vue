<template lang="pug">

  .burger-menu(v-if="!isRegistering" name="burger-menu" v-on:click="toggleLeftDrawer" v-bind:class="{ active: (state === 'close') }")
    .bar-wrapper(v-bind:class="{cross: (state === 'close') }")
      .top-bar
      .bottom-bar

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
      this.$ga.event('burger-menu', 'clicked', 1);
      this.$store.commit('TOGGLE_LEFT_DRAWER');
    },
  },
  computed: {
    state() {
      return this.$store.state.navigation.burger.state;
    },
    isRegistering() {
      return this.$route.name === 'registration';
    },
  },
};

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.burger-menu
  radius(50%)
  animate()
  background-color transparent
  height 50px
  width 52px

  position fixed
  top 0
  left 0
  z-index 55

  .bar-wrapper
    pinned()
    position absolute
    .bottom-bar, .top-bar
      animate()
      pinned()
      background-color white
      height 2px
      left 12px 
      right 12px
      position absolute
    .top-bar
      top 18px
      bottom auto
    .bottom-bar
      bottom 18px
      top auto

  &:hover
    cursor pointer
    .bar-wrapper
      .top-bar
        left 10px
        right 14px
      .bottom-bar
        right 10px
        left 14px
  /* Active styles */
  &.active
    background-color transparent
    left calc(100% - 60px)
    z-index 56
    @media(min-width: 360px)
      left 310px
  
  .bar-wrapper
    &.cross
      .bottom-bar, .top-bar
        left 12px !important
        right 12px !important
      .top-bar
        top 24px !important
        transform rotate(-45deg)
      .bottom-bar
        bottom 24px !important
        transform rotate(45deg)

</style>
