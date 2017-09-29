<template lang="pug">

.animated-logo(@click="goHome")
  #logo-text {{ $app.name }}
  //- img.logo(src="../assets/logos/main-white.svg")
  //- svg(id="logo" v-bind:class="{loaded: loaded}" width="140" height="77" viewBox="0 0 140 77")
    path#main(d="M1069.34,221.6l-34.53-61.74L1004,212.25l-2.14,3.45a37.58,37.58,0,1,1-7.5-47" transform="translate(-930.95 -158.24)")
    line#bar(x1="98" y1="50" x2="110" y2="50")

</template>

<script>
export default {
  name: 'animated-logo',
  // data() {
  //   return {
  //     loaded: false,
  //   };
  // },
  // mounted() {
  //   setTimeout(() => { this.loaded = true }, 0);
  // },
  methods: {
    goHome() {
      this.$router.push('/');
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

easeInOutSine = cubic-bezier(0.445, 0.050, 0.550, 0.950)
easeOutBack   = cubic-bezier(0.250,-0.250, 0.750, 1.250)
easing = easeInOutSine
duration = 1s

dash-offset-cross = 0px
cross-length = 320px

.animated-logo
  pinned()
  transition(all 0.2s ease)
  background-color $color-primary
  border-bottom alpha(black, 0.1) 1px solid
  bottom auto
  height 60px
  position absolute
  z-index 50
  &:hover
    cursor pointer
  #logo-text
    color white
    font-size 1em
    font-weight bold
    line-height 40px
    margin 10px
  img
    display none
    height 40px
    margin 10px
  svg#logo
    transform(scale(.5,.5))
    path, line
      fill none
      transition stroke-dashoffset duration easing, stroke-dasharray duration easing
      stroke-width 3px
      stroke-linejoin round
      stroke-linecap round
      stroke white
      stroke-dashoffset -320px
      stroke-dasharray 330px cross-length

    &.loaded
      path
        &#main
          stroke-dashoffset 0
      line
        &#bar
          stroke-dashoffset 0

    &:hover
      cursor pointer

#app
  &.chat
    .animated-logo
      background-color $color-homework

  &.admin
    .animated-logo
      background-color $color-darkest-grey

  &.fourcorners
    .animated-logo
      // background-color $color-fourcorners
      background-color $color-darkest-grey
      // #logo-text
      //   display none
      // img.fourcorners-logo
      //   display inline-block

</style>
