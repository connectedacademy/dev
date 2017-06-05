<template lang="pug">

  .auth-modal(v-bind:class="{ visible: visible }")
    .auth-modal--header
      h1 {{ $t('auth.authenticate') }}
    .auth-modal--container
      p Click the button below to authenticate with Twitter, this will give you access to advanced functionality within the platform.

      button.pure-button.pure-button-primary(v-on:click.once="attemptAuth")
        | {{ $t('auth.login_with_twitter') }}

</template>

<script>
export default {
  name: 'authentication-flow',
  computed: {
    visible() {
      return this.$store.state.auth.visible;
    },
  },
  methods: {
    attemptAuth() {
      this.$store.commit('attemptAuth');
    },
  },
};
</script>

<style lang="stylus" scoped>

@import "../../assets/stylus/shared";

.auth-modal
  animate()
  display block
  max-width 320px
  position fixed
  z-index 53
  top 120px
  left 50%
  margin-left -160px
  opacity 0
  pointer-events none
  &.visible
    top 80px
    opacity 1
    pointer-events all
  .auth-modal--header
    height 40px
    line-height 40px
    text-align center
    h1
      nomargin()
      nopadding()
      color white
      font-size 1.2em
  .auth-modal--container
    radius(12px)
    background-color white
    padding 20px 30px
    text-align center
    p
      margin 0 0 20px 0

</style>
