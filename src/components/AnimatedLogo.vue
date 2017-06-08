<template lang="pug">

.animated-logo#logo(@click="goHome")
  //- img.logo(src="../assets/logos/main-white.svg")
  svg(id="logo" v-bind:class="{loaded: loaded}" width="139.37" height="77" viewBox="0 0 139.37 77" transform="scale(.5,.5)")
    path#main(d="M1069.34,221.6l-34.53-61.74L1004,212.25l-2.14,3.45a37.58,37.58,0,1,1-7.5-47" transform="translate(-930.95 -158.24)")
    line#bar(x1="98" y1="50" x2="110" y2="50")

</template>

<script>

export default {
  name: 'animated-logo',
  data() {
    return {
      loaded: false,
    };
  },
  mounted() {
    var self = this;
    setTimeout(function() {
      self.loaded = true;
    }, 0);
  },
  methods: {
    goHome() {
      this.$router.push('/');
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

svg#logo
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

</style>
