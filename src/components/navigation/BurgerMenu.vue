<template lang="pug">

  .burger-menu(v-on:click="toggleLeftDrawer" v-bind:class="{ active: (state === 'close'), hidden: minimized }")
    transition(name="rotate")
      ul.stack
        li.bar
        li.bar

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
      this.$store.commit('TOGGLE_LEFT_DRAWER');
    },
  },
  computed: {
    state() {
      return this.$store.state.navigation.burger.state;
    },
    minimized() {
      return (this.navigation && this.navigation.minimized);
    },
  },
};

</script>

<style lang="stylus" scoped>

@import "../../assets/stylus/shared";

rotate_transform(args)
  -ms-transform args
  -webkit-transform args
  transform args

.burger-menu
  height 60px
  width 60px

  position fixed
  top 0
  left 0
  z-index 50

  transition left 0.4s

  &:hover
    cursor pointer

  ul.stack
    list-style none
    margin 0
    padding	13px 15px
    li.bar
      list-style none
      margin 10px 0
      padding 0

      background-color white
      height 2px
      position relative
      top 0

      transition transform 0.6s, top 0.6s

  /* Active styles */
  &.active
    background-color transparent
    left calc(100% - 120px)
    z-index 52
    @media(min-width: 400px)
      left 260px
    ul.stack li.bar:first-child
      top 6px
      rotate_transform(rotate(45deg))
    ul.stack li.bar:last-child
      top -6px
      rotate_transform(rotate(-45deg))

/* App states */

#app.authenticating
  .burger-menu
    display none

</style>
