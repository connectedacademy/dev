<template lang="pug">

.col

  .container.registration-container(v-if="!checkingAuthentication")

    profile-step(v-if="currentStep === 1" v-bind:response.sync="response" v-on:nextStep="nextStep" v-on:previousStep="previousStep")

    .questions-wrapper(v-if="paged" v-for="(question, index) in questions" v-bind:key="index")
      question-step(v-if="currentStep === (index + 2)" v-bind:response.sync="response" v-bind:question.sync="question" v-on:nextStep="nextStep" v-on:previousStep="previousStep")
    
    .questions-wrapper(v-else)
      question-step(v-if="currentStep === 2" v-bind:response.sync="response" v-bind:questions.sync="questions" v-on:nextStep="nextStep" v-on:previousStep="previousStep")

    schedule-step(v-if="currentStep === (questions.length + 2)" v-bind:form-is-valid="true" v-bind:response.sync="response" v-on:attemptRegistration="attemptRegistration" v-on:previousStep="previousStep")

</template>

<script>
  import { mapGetters } from 'vuex';
  import API from '@/api';

  // Lodash
  import every from 'lodash/every';
  import values from 'lodash/values';

  import Auth from '@/mixins/Auth';
  import PageStyle from '@/mixins/PageStyle';
  
  // Registration Steps
  import ProfileStep from '@/components/registration/ProfileStep';
  import QuestionStep from '@/components/registration/QuestionStep';
  import TermsStep from '@/components/registration/TermsStep';
  import ScheduleStep from '@/components/registration/ScheduleStep';

  import Validator from 'validator';

  export default {
    name: 'registration',
    mixins: [ PageStyle, Auth ],
    components: {
      ProfileStep,
      QuestionStep,
      TermsStep,
      ScheduleStep
    },
    mounted() {

      this.ensureNotRegistered();
      // this.checkingAuthentication = false

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
        pageStyle: { type: 'registration', minimized: false },
        paged: true,
        currentStep: 1,
        loadingQuestions: true,
        release: '',
        questions: [],
        response: {
          consent: true,
          hub_id: '',
          email: '',
          age: '0',
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
      termsMarkdown() {
  
        const md = new MarkdownIt({
          html: true,
          linkify: true,
        });
  
        return `<div>${md.render(this.release)}</div>`;
      },
    },
    methods: {
      nextStep() {
        this.currentStep += 1;
      },
      previousStep() {
        this.currentStep -= 1;
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
