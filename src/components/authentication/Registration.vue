<template lang="pug">

.col#col-main.narrow

  .container.registration-container(v-if="!checkingRegistration")

    form.pure-form.pure-form-stacked

      .registration-page(v-if="currentPage === 1")

        .content-block.white-block

          info-dialogue
            p Please fill in the fields below to register for Connected Academy, don't forget to select your hub.

          fieldset.validate(v-bind:class="{ valid: validatedResponse.email }")
            label {{ $t('auth.enter_your_email') }}
            input(type="text" v-model="response.email")

          fieldset.validate(v-bind:class="{ valid: validatedResponse.age }")
            label {{ $t('auth.enter_your_age') }}
            input(type="text" v-model="response.age")

          fieldset.validate(v-bind:class="{ valid: validatedResponse.lang }")
            label {{ $t('auth.select_your_language') }}
            select(v-model="response.lang")
              option(value="") {{ $t('common.choose_one') }}
              option(v-for="lang in course.langs") {{ getCountryName(lang) }}

          fieldset
            label Pick the hub closest to your timezone to receive notifications when class content is released.
            ul.hub-selector
              li.hub-selector--tile(v-for="hub in hubs" v-bind:class="{ selected: (response.hub_id === hub.id) }" @click="response.hub_id = hub.id")
                h1.hub-title {{ hub.name }}
                h2.hub-timezone {{ hub.timezone }}

          router-link.pure-button(to="/") {{ $t('common.cancel') }}
          .pure-button.pure-button-primary.pull-right(v-bind:disabled="!formIsValid" @click="nextPage") {{ $t('common.continue') }}
          .clearfix

      .registration-page(v-if="currentPage === 2")

        .content-block.white-block

          info-dialogue
            p {{ $t('auth.read_the_following') }}

          #terms-markdown(v-html="termsMarkdown")

          fieldset
            label.pure-checkbox(for="consent-cb")
              input#consent-cb(type="checkbox" v-model="response.consent")
              | {{ $t('auth.i_agree_to_terms_and_conditions') }}

          hr

          .pure-button(@click="previousPage") {{ $t('common.previous_page') }}
          .pure-button.pure-button-primary.pull-right(v-bind:disabled="!response.consent" @click="nextPage") {{ $t('common.continue') }}
          .clearfix

      .registration-page(v-if="currentPage === 3")

        .content-block.white-block

          info-dialogue
            p {{ $t('auth.answer_the_following') }}

          .question-wrapper(v-if="!loadingQuestions" v-for="(question, index) in questions")

            fieldset
              label {{ question.text }}

            fieldset.pure-group

              .vue-slider-wrapper(v-if="question.response_type === 'scale'")
                vue-slider(v-bind:min="0" v-bind:max="5" v-bind:tooltip-style="{ 'background-color': '#0078E7', 'border-top-color': '#0078E7' }" v-bind:bg-style="{ 'background-color': '#d9d9d9' }" v-bind:process-style="{ 'background-color': '#d9d9d9' }" ref="slider" v-model="response.registration_info.answers[question.id]")

              input.full-width(v-model="response.registration_info.answers[question.id]" v-if="question.response_type === 'text'" type="text")

              input.full-width(v-model="response.registration_info.answers[question.id]" v-if="question.response_type === 'boolean'" type="checkbox")

          hr

          .pure-button(@click="previousPage") {{ $t('common.previous_page') }}
          .pure-button.pure-button-primary.pull-right(v-bind:disabled="!formIsValid || !response.consent" @click="attemptRegistration") {{ $t('auth.attempt_registration') }}
          .clearfix

</template>

<script>
import _ from 'lodash';
import {mapGetters} from 'vuex';
import * as types from '@/store/mutation-types';
import API from '@/api';


import MarkdownIt from 'markdown-it';

import MarkdownRenderer from '@/components/MarkdownRenderer';
import InfoDialogue from '../InfoDialogue';
import Validator from 'validator';
import VueSlider from 'vue-slider-component';

export default {
  name: 'registration',
  components: {
    MarkdownRenderer,
    InfoDialogue,
    VueSlider,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      document.documentElement.className = 'colourful';
    });
  },
  beforeRouteLeave (to, from, next) {
    // Reset state
    document.documentElement.className = '';
    next();
  },
  created() {
    API.auth.checkAuth(
      (response) => {
        this.checkingRegistration = false;
        if (response.user.registration) {
          // this.$router.replace('/');
        }
      },
      (response) => {
        // TODO: Better handle failed request
        this.checkingRegistration = false;
      },
    );

    API.auth.fetchQuestions(
      (response) => {
        this.release = response.release;
        this.questions = response.questions;
        this.loadingQuestions = false;
      },
      (response) => {
        // TODO: Better handle failed request
        this.loadingQuestions = false;
      },
    );
  },
  data() {
    return {
      currentPage: 1,
      loadingQuestions: true,
      checkingRegistration: true,
      release: '',
      questions: [],
      response: {
        consent: false,
        hub_id: '',
        email: '',
        age: '',
        lang: '',
        registration_info: {
          answers: {},
        },
      },
    };
  },
  computed: {
    ...mapGetters([
      'course', 'hubs', 'user', 'isRegistered',
    ]),
    sanitizedResponse() {
      return {
        consent: this.response.consent,
        hub_id: this.response.hub_id,
        email: Validator.normalizeEmail(this.response.email),
        age: Validator.toInt(this.response.age),
        lang: this.response.lang,
        registration_info: {
          answers: this.response.registration_info.answers,
        },
      };
    },
    validatedResponse() {
      return {
        hub_id: !Validator.isEmpty(this.response.hub_id),
        email: Validator.isEmail(this.response.email),
        age: Validator.isInt(this.response.age, { min: 1, max: 150 }),
        lang: !Validator.isEmpty(this.response.lang),
      };
    },
    formIsValid() {
      return _.every(_.values(this.validatedResponse), v => v);
    },
    termsMarkdown() {

      const md = new MarkdownIt({
        html: true,
        linkify: true,
      });

      return `<div>${md.render(this.release)}</div>`;
    },
  },
  methods: {
    nextPage() {
      this.currentPage += 1;
    },
    previousPage() {
      this.currentPage -= 1;
    },
    attemptRegistration() {
      API.auth.register(
        this.sanitizedResponse,
        (response) => {
          this.$router.push({ path: '/' });
        },
        (response) => {
          // alert('Registration failed');
          this.$router.push({ path: '/' });
        },
      );
    },
    getCountryName(lang) {
      return lang;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.col#col-main
  .registration-container
    .registration-container--header
      text-align center
      h1, h2
        reset()
        color white
        padding 20px 0px 20px 0px

    form

      fieldset.validate
        input, select
          border-color $color-danger
        &.valid
          input, select
            border-color $color-success
      hr
        border none
        border-top $color-light-grey 1px solid
        height 0
        margin-bottom 20px

      input, select
        margin 10px 0
        min-width 200px
        &.full-width
          width 100%

      input[type="checkbox"]
        margin-right 10px

      .question-wrapper
        label
          font-weight bold

      button
        margin-left 10px

      .vue-slider-wrapper
        padding-top 30px

ul.hub-selector
  cleanlist()
  margin 0 -10px
  li.hub-selector--tile
    cleanlist()
    animate()
    background-color white
    border $color-border 1px solid
    display inline-block
    overflow hidden
    text-align center
    position relative

    margin 10px
    padding 10px 20px

    width 120px

    h1.hub-title
      animate()
      reset()
      color $color-text-dark-grey
      font-size 1.2em
      line-height 30px
      padding 15px 0
    h2.hub-timezone
      animate()
      reset()
      color $color-text-light-grey
      font-size 1em
      line-height 20px
      opacity 0
      position absolute
      left 0
      right 0
      bottom 0

    &:hover
      cursor pointer
      border-color $color-primary
      background-color darken($color-primary, 10%)
      h1.hub-title, h2.hub-timezone
        color white
      h1.hub-title
        padding 5px 0 25px 0
      h2.hub-timezone
        bottom 15px
        opacity 1

    &.selected
      background-color $color-success
      border-color $color-success
      h1.hub-title, h2.hub-timezone
        color white

#terms-markdown
  radius(4px)
  background-color $color-light-grey
  border $color-light-grey 1px solid
  max-height 340px
  padding 5px 15px
  overflow-y auto
  overflow-x none
</style>
