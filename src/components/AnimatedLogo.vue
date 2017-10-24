<template lang="pug">

.animated-logo(@click="goHome")
  #logo-text {{ $app.name }}

</template>

<script>
export default {
  name: 'animated-logo',
  methods: {
    goHome() {
      this.$router.push({ name: 'course' });
      this.$store.commit('PAUSE_MEDIA');
      setTimeout(() => {
        window.scroll(0, 0);
      }, 500);
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.animated-logo
  pinned()
  transition(all 0.2s ease)
  background-color $color-primary
  border-bottom alpha(black, 0.1) 1px solid
  bottom auto
  height 50px
  position absolute
  z-index 50
  &:hover
    cursor pointer
  #logo-text
    color white
    font-size 1em
    font-weight bold
    line-height $navigation-height
    margin 0 10px
    &:hover
      cursor pointer

#app
  &.chat .animated-logo
    background-color $color-homework

  &.admin .animated-logo
    background-color $color-darkest-grey

  &.fourcorners .animated-logo
    background-color $color-darkest-grey

</style>
