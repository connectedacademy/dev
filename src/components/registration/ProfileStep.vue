<template lang="pug">

  .registration-page.profile-step

    .content-block.white-block.animated.fadeInUp

      form.pure-form.pure-form-stacked

        img#user-avatar(v-bind:src="profileImage")
        
        fieldset.validate(v-bind:class="{ valid: validatedResponse.email }")
          label(for="email") {{ $t('auth.enter_your_email') }}
          input.full-width.large(name="email" type="text" v-model="response.email" placeholder="name@example.com" required)

        .clearfix

        .terms-message
          span By continuing you are agreeing to our 
          a(href="/#/terms" target="_blank") terms and conditions
          span {{ ` and understand that you are partaking in a research study.` }}
        
        br

        .pure-button.pure-button-info.rounded-short(v-bind:disabled="!canContinue" @click="$emit('nextStep')") {{ $t('common.continue') }}
        .clearfix
  
</template>

<script>
  import { mapGetters } from 'vuex'
  import Validator from 'validator'

  export default {
    name: 'profile-step',
    props: ['response'],
    computed: {
      ...mapGetters(['user', 'course']),
      profile() {
        return `url('${this.$store.state.auth.user.profile}')`
      },
      profileImage() {
        if (!(this.user && this.user.profile.avatar)) return
        return this.user.profile.avatar.replace('_normal', '')
      },
      validatedResponse() {
        return {
          hub_id: !Validator.isEmpty(this.response.hub_id),
          email: Validator.isEmail(this.response.email)
        }
      },
      canContinue() {
        return this.validatedResponse.email
      }
    }
  }
</script>

<style lang="stylus" scoped>

@import '~stylus/registration'

.registration-page.profile-step
  margin 0 auto
  max-width 400px
  text-align center
  img#user-avatar
    radius(50%)
    background-color $color-lightest-grey
    height 100px
    margin 20px auto
    width 100px
  .terms-message
    a
      color $color-text-grey

</style>
