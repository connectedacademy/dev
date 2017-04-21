<template lang="pug">

.col#col-main.narrow

  .container.registration-container
    .registration-container--header
      h1 {{ $t('auth.register') }}

    form.pure-form.pure-form-stacked

      .content-block.white-block
        h5 {{ $t('auth.read_the_following') }}
        p(v-if="loading") {{ $t('common.loading') }}
        p {{ release }}

        fieldset
          label.pure-checkbox(for="cb")
            input#cb(type="checkbox" v-model="response.consent")
            | {{ $t('auth.i_agree_to_terms_and_conditions') }}

        fieldset
          label Enter your email
          input(type="text" v-model="response.email")

        fieldset
          label Enter your age
          input(type="text" v-model="response.age")

      .content-block.white-block
        fieldset
          label Select your hub
          ul.hub-selector
            li.hub-selector--tile(v-for="hub in hubs" v-bind:class="{ selected: (response.hub_id === hub.id) }" @click="response.hub_id = hub.id") {{ hub.name }}

      .content-block.white-block(v-if="response.consent")
        h5 {{ $t('auth.answer_the_following') }}

        .question-wrapper(v-for="(question, index) in questions")

          fieldset
            label {{ question.text }}

            fieldset.pure-group
              .vue-slider-wrapper
                <vue-slider :min="0" :max="10" :tooltip-style="{ 'background-color': '#0078E7', 'border-top-color': '#0078E7' }" :bg-style="{ 'background-color': '#222' }" :process-style="{ 'background-color': '#0078E7' }" ref="slider" v-model="response.registration_info.answers[question.id]"></vue-slider>

              input(v-if="question.response_type === 'text'" type="text" placeholder="Text")
              input(v-if="question.response_type === 'boolean'" type="checkbox" placeholder="Boolean")

        hr

        router-link.pure-button(to="/") {{ $t('common.cancel') }}
        .pure-button.pure-button-primary.pull-right(@click="attemptRegistration") {{ $t('auth.attempt_registration') }}
        .clearfix

</template>

<script>
import vueSlider from 'vue-slider-component';
import API from '../../api';

export default {
  name: 'registration',
  created() {
    // Push user to home if not authenticated
    // if (!this.$store.state.auth.isAuthenticated) { this.$router.push('/'); }

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
      loading: true,
      release: '',
      questions: [],
      response: {
        consent: false,
        hub_id: '',
        region: '',
        email: '',
        age: '',
        registration_info: {
          answers: {},
        },
      },
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
  components: {
    vueSlider,
  },
  methods: {
    attemptRegistration() {
      API.auth.register(
        this.response,
        (response) => {
          this.$router.push({ path: '/' });
        },
        (response) => {
          // alert('Registration failed');
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

      .vue-slider-wrapper
        padding-top 30px

ul.hub-selector
  cleanlist()
  margin 0 -10px
  li.hub-selector--tile
    cleanlist()
    background-color $color-primary
    color white
    display inline-block
    line-height 60px
    overflow hidden
    text-align center

    margin 10px
    padding 0 20px

    height 60px
    width 120px

    &:hover
      cursor pointer
      background-color darken($color-primary, 10%)

    &.selected
      background-color $color-success
</style>
