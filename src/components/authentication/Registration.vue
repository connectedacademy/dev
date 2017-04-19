<template lang="pug">

.col#col-main.narrow

  .container.registration-container
    .registration-container--header
      h1 {{ $t('auth.register') }}
      h2.text-white(hidden) {{ $t('auth.welcome_to_registration') }}

    form.pure-form.pure-form-stacked

      .content-block.white-block
        h5 {{ $t('auth.read_the_following') }}
        p(v-if="loading") {{ $t('common.loading') }}
        p {{ release }}

        fieldset
          label.pure-checkbox(for="cb")
            input#cb(type="checkbox" v-model="agree")
            | {{ $t('auth.i_agree_to_terms_and_conditions') }}

      .content-block.white-block
        fieldset
          label Select your hub
          select
            option(v-for="hub in hubs" v-model="hub.id") {{ hub.name }}

      .content-block.white-block(v-if="agree")
        h5 {{ $t('auth.answer_the_following') }}

        pre.hidden {{ questions }}

        .question-wrapper(v-for="(question, index) in questions")

          fieldset
            label {{ question.text }}
            fieldset.pure-group
              input(v-if="question.response_type === 'scale'" type="range" name="points" min="0" max="10" v-model="response[index]")
              span(v-if="question.response_type === 'scale'") {{ `Answer: ${response[index]}` }}
            input(v-if="question.response_type === 'text'" type="text" placeholder="Text")
            input(v-if="question.response_type === 'boolean'" type="checkbox" placeholder="Boolean")

        hr

        router-link.pure-button(to="/") {{ $t('common.cancel') }}
        .pure-button.pure-button-primary.pull-right(@click="attemptRegistration") {{ $t('auth.attempt_registration') }}
        .clearfix

</template>

<script>
/* eslint-disable */
import API from '../../api';

export default {
  name: 'registration',
  created() {
    API.auth.fetchQuestions(
      (response) => {
        this.release = response.release;
        this.questions = response.questions;
        this.loading = false;
      },
      (response) => {
        // TODO: Handle failed request
      },
    );
  },
  data() {
    return {
      agree: false,
      loading: true,
      release: '',
      questions: [],
      response: [],
    };
  },
  computed: {
    hubs() {
      return this.$store.getters.hubs;
    },
    user() {
      return this.$store.state.auth.user;
    },
  },
  components: {},
  methods: {
    attemptRegistration() {
      API.auth.register(
        this.response,
        (response) => {
          this.$router.push({ path: '/' });
        },
        (response) => {
          alert('Registration failed');
          this.$router.push({ path: '/' });
        },
      );
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '../../assets/stylus/layout/page'
@import '../../assets/stylus/shared/*'

.col#col-main.narrow
  .registration-container
    .registration-container--header
      text-align center
      h1, h2
        nomargin()
        nopadding()
        padding 20px 0px 20px 0px

    form

      hr
        border none
        border-top $color-light-grey 1px solid
        height 0
        margin-bottom 20px

      h5
        nomargin()
        color $color-text-grey
        padding 10px 0

      input
        margin 10px 0

      input[type="checkbox"]
        margin-right 10px

      .question-wrapper
        label
          font-weight bold

      button
        margin-left 10px

</style>
