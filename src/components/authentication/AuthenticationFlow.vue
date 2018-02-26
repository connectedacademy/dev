<template lang="pug">
transition(name="slide-up")
  .auth-modal(v-if="isVisible")
    .auth-modal--header
      h1 {{ $t('auth.authenticate') }}
    .auth-modal--container
      p Sign in with Twitter to gain full access to Connected Academy.

      button.pure-button.pure-button-twitter.rounded-tall(name="twitter-login-button" v-on:click.once="attemptAuth")
        | {{ $t('auth.login_with_twitter') }}

</template>

<script>
export default {
  name: 'authentication-flow',
  computed: {
    isVisible() {
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

@import '~stylus/shared'
@import '~stylus/buttons'

// Transitions
.slide-up-enter-active
  animate()

.slide-up-leave-active
  animate()

.slide-up-enter, .slide-up-leave-to
  transform translateY(40px)
  opacity 0


.auth-modal
  animate()
  display block
  max-width 320px
  position fixed
  z-index 57
  top 80px
  left 50%
  margin-left -160px

  .auth-modal--header
    height 40px
    line-height 40px
    text-align center
    h1
      reset()
      color white
      font-size 1.2em
  .auth-modal--container
    radius($corner-radius)
    background-color white
    padding 20px 30px
    text-align center
    p
      margin 0 0 20px 0

</style>
