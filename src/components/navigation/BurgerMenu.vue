<template lang="pug">

  .burger-menu(v-on:click="toggleLeftDrawer" v-bind:class="{ active: (state === 'close') }")
    transition(name="rotate")
      ul.stack
        li.bar
        li.bar

</template>

<script>

export default {
  name: 'burger-menu',
  methods: {
    toggleLeftDrawer() {
      this.$store.commit('TOGGLE_LEFT_DRAWER');
    },
  },
  computed: {
    state() {
      return this.$store.state.navigation.burger.state;
    },
  },
};

</script>

<style lang="stylus" scoped>

rotate_transform(args)
  -ms-transform args
  -webkit-transform args
  transform args

.burger-menu
  height 60px
  width 60px

  position absolute
  top 0
  left 0
  z-index 50

  transition left 0.4s

  &:hover
    cursor pointer

  ul.stack
    list-style none
    margin 0
    padding	12px 15px
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
</style>
