<template lang="pug">

  .auth-modal(v-bind:class="{ visible: visible }")
    .auth-modal--header
      h1 {{ $t('auth.authenticate') }}
    .auth-modal--container
      form.pure-form.pure-form-stacked(v-on:submit.prevent="authenticate")
        fieldset
          label {{ $t('auth.form.your_name') }}
          input(type="text" v-bind:placeholder="$t('auth.form.name_placeholder')")
        fieldset
          label {{ $t('auth.form.your_organisation') }}
          input(type="text" v-bind:placeholder="$t('auth.form.organisation_placeholder')")
        fieldset
          label.pure-checkbox(for="cb")
            input#cb(type="checkbox")
            | {{ $t('auth.i_agree_to_terms_and_conditions') }}
        fieldset
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
      this.$store.commit('attemptAuth', {
        name: this.$t('auth.test.user.name'),
        organisation: this.$t('auth.test.user.organisation'),
      });
    },
  },
};
</script>

<style lang="stylus" scoped>

@import "../../assets/stylus/shared/*";

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
    min-height 200px
    padding 20px 30px
    text-align center
    form
      text-align center
      fieldset
        text-align center
        label
          color $color-grey
          text-align left
      input
        text-align left
        width 100%
      input[type="checkbox"]
        margin-right 10px
        width auto

</style>
