<template lang="pug">

  .registration-page.profile-step

    .content-block.white-block.animated.fadeInUp

      form.pure-form.pure-form-stacked

        img#user-avatar(v-bind:src="profileImage")
        
        fieldset.validate(v-bind:class="{ valid: validatedResponse.email }")
          label(for="email") {{ $t('auth.enter_your_email') }}
          input.full-width.large(name="email" type="text" v-model="response.email" placeholder="name@example.com" required)

        //- fieldset.validate(v-bind:class="{ valid: validatedResponse.age }")
          label {{ $t('auth.enter_your_age') }}
          input(type="text" v-model="response.age")

        //- fieldset.validate(v-bind:class="{ valid: validatedResponse.lang }")
          label {{ $t('auth.select_your_language') }}
          select(v-model="response.lang")
            option(v-for="(lang, index) in course.langs") {{ getCountryName(lang) }}
        
        .clearfix

        .terms-message
          | By continuing you are agreeing to our terms and conditions and understand that you are partaking in a research study.
        
        br

        .pure-button.pure-button-info.rounded-short(v-bind:disabled="!canContinue" @click="$emit('nextStep')") {{ $t('common.continue') }}
        .clearfix
  
</template>

<script>
  import { mapGetters } from 'vuex'
  import Validator from 'validator';

  export default {
    name: 'profile-step',
    props: ['response'],
    computed: {
      ...mapGetters(['user', 'course']),
      profile() {
        return `url('${this.$store.state.auth.user.profile}')`;
      },
      profileImage() {
        return this.user.profile.replace('_normal', '');
      },
      validatedResponse() {
        return {
          hub_id: !Validator.isEmpty(this.response.hub_id),
          email: Validator.isEmail(this.response.email),
          age: Validator.isInt(this.response.age, {
            min: 1,
            max: 150
          }),
          lang: !Validator.isEmpty(this.response.lang),
        };
      },
      canContinue() {
        return this.validatedResponse.email;
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

</style>
