<template lang="pug">

.col#col-main.narrow

  .container.registration-container(v-if="!checkingAuthentication")

    form.pure-form.pure-form-stacked

      .registration-page(v-if="currentPage === 1")

        .content-block.white-block

          info-dialogue
            p {{ $t('auth.registration_message') }}

          fieldset.validate(v-bind:class="{ valid: validatedResponse.email }")
            label {{ $t('auth.enter_your_email') }}
            input(type="text" v-model="response.email")

          fieldset.pull-left.validate(v-bind:class="{ valid: validatedResponse.age }")
            label {{ $t('auth.enter_your_age') }}
            input(type="text" v-model="response.age")

          fieldset.pull-left.validate(v-bind:class="{ valid: validatedResponse.lang }" v-if="course.langs.length > 1")
            label {{ $t('auth.select_your_language') }}
            select(v-model="response.lang")
              option(v-for="(lang, index) in course.langs") {{ getCountryName(lang) }}
          
          .clearfix

          hr

          fieldset
            label Pick the hub closest to your timezone to receive notifications when class content is released.
            ul.hub-selector
              li.hub-selector--tile(v-for="hub in hubs" v-bind:class="{ selected: (response.hub_id === hub.id) }" @click="response.hub_id = hub.id")
                h1.hub-title {{ hub.name }}
                h2.hub-timezone {{ hub.timezone }}
              .clearfix

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
  import every from 'lodash/every';
  import values from 'lodash/values';
  import { mapGetters } from 'vuex';
  import API from '@/api';

  import Auth from '@/mixins/Auth';
  import PageStyle from '@/mixins/PageStyle';

  import MarkdownIt from 'markdown-it';
  
  import MarkdownRenderer from '@/components/MarkdownRenderer';
  import InfoDialogue from '../InfoDialogue';
  import Validator from 'validator';
  import VueSlider from 'vue-slider-component';
  
  export default {
    name: 'registration',
    mixins: [ PageStyle, Auth ],
    components: {
      MarkdownRenderer,
      InfoDialogue,
      VueSlider,
    },
    mounted() {

      this.ensureNotRegistered();

      this.$store.dispatch('getHubs');
  
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
        pageStyle: { type: 'registration', minimized: true },
        currentPage: 1,
        loadingQuestions: true,
        release: '',
        questions: [],
        response: {
          consent: false,
          hub_id: '',
          email: '',
          age: '',
          lang: 'en',
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
          age: Validator.isInt(this.response.age, {
            min: 1,
            max: 150
          }),
          lang: !Validator.isEmpty(this.response.lang),
        };
      },
      formIsValid() {
        return every(values(this.validatedResponse), v => v);
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
            this.$store.dispatch('checkAuth');
            this.$router.push('course');
          },
          (response) => {
            this.$log.info('Registration failed');
            this.$store.dispatch('checkAuth');
            this.$router.push('course');
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
@import '~stylus/buttons'
@import '~stylus/forms'

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
          margin-top 24px
        &.valid
          input, select
            border-color $color-success
      hr
        border none
        border-top $color-light-grey 1px solid
        height 0
        margin-bottom 20px

      input, select
        max-width calc(100% - 20px)
        width 260px
        &.full-width
          width 100%

      input[type="checkbox"]
        width auto
      
      select
        font-size 1.1em

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
    box-sizing()
    border $color-border 1px solid
    float left
    height 100px
    overflow hidden
    text-align center
    position relative

    margin 10px
    padding 10px 0px

    width calc((calc(100% - 0px) / 3) - 20px)
    @media(max-width: 600px)
      width calc(50% - 20px)

    h1.hub-title
      animate()
      reset()
      color $color-text-dark-grey
      font-size 1.2em
      line-height 30px
      padding 15px 0
      position absolute
      top 50%
      margin-top -30px
      text-align center
      width 100%
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
      top 50%
      margin-top 5px

    &:hover
      cursor pointer
      border-color $color-primary
      background-color darken($color-primary, 10%)
      h1.hub-title, h2.hub-timezone
        color white
      h1.hub-title
        margin-top -45px
      h2.hub-timezone
        opacity 1

    &.selected
      background-color $color-success
      border-color $color-success
      h1.hub-title, h2.hub-timezone
        color white

#terms-markdown
  radius(4px)
  background-color $color-lightest-grey
  max-height 340px
  min-height 200px
  padding 5px 15px
  overflow-y auto
  overflow-x none
</style>
