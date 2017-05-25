<template lang="pug">

.col#col-main.narrow

  .container.registration-container
    .registration-container--header
      h1 {{ $t('auth.register') }}

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

          .question-wrapper(v-for="(question, index) in questions")

            fieldset
              label {{ question.text }}

            fieldset.pure-group

              .vue-slider-wrapper(v-if="question.response_type === 'scale'")
                <vue-slider :min="0" :max="10" :tooltip-style="{ 'background-color': '#0078E7', 'border-top-color': '#0078E7' }" :bg-style="{ 'background-color': '#e1e1e1' }" :process-style="{ 'background-color': '#0078E7' }" ref="slider" v-model="response.registration_info.answers[question.id]"></vue-slider>

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
      vm.$store.commit(types.SET_NAV_STATE, false);
    });
  },
  beforeRouteLeave (to, from, next) {
    // Reset state
    this.$store.commit(types.SET_NAV_STATE, true);
    next();
  },
  created() {
    API.auth.checkAuth(
      response => {
        if (response.user.registration) {
          // this.$router.replace('/');
        }
      },
    );

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
      currentPage: 1,
      loading: true,
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
      return lang.toUpperCase();
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '../../assets/stylus/layout/page'
@import '../../assets/stylus/shared/*'

.col#col-main
  .registration-container
    .registration-container--header
      text-align center
      h1, h2
        nomargin()
        nopadding()
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
    background-color #e1e1e1
    display inline-block
    overflow hidden
    text-align center

    margin 10px
    padding 10px 20px

    width 120px

    h1.hub-title
      animate()
      nomargin()
      nopadding()
      color #444
      font-size 1.2em
      line-height 30px
    h2.hub-timezone
      animate()
      nomargin()
      nopadding()
      color #444
      font-size 1em
      line-height 30px

    &:hover
      cursor pointer
      background-color darken($color-primary, 10%)
      h1.hub-title, h2.hub-timezone
        color white

    &.selected
      background-color $color-success
      h1.hub-title, h2.hub-timezone
        color white

#terms-markdown
  radius(4px)
  background-color $color-light-grey
  border $color-light-grey 1px solid
  max-height 340px
  padding 5px 15px
  overflow scroll
</style>
