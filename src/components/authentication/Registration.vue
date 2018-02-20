<template lang="pug">

.col

  .container.registration-container

    profile-step(v-if="currentStep === 1" v-bind:response.sync="response" v-on:nextStep="nextStep" v-on:previousStep="previousStep")

    .registration-page(v-for="(question, index) in questions" v-bind:key="index")
      question-step(v-if="currentStep === (index + 2)" v-bind:answers.sync="response.registration_info.answers" v-bind:question.sync="question" v-on:nextStep="nextStep" v-on:previousStep="previousStep")

    schedule-step(v-if="currentStep === (questions.length + 2)" v-bind:form-is-valid="true" v-bind:response.sync="response" v-on:attemptRegistration="attemptRegistration" v-on:previousStep="previousStep")

</template>

<script>
  import { mapGetters } from 'vuex'
  import API from '@/api'

  // Mixins
  import Auth from '@/mixins/Auth'
  import PageStyle from '@/mixins/PageStyle'
  
  // Registration Steps
  import ProfileStep from '@/components/registration/ProfileStep'
  import QuestionStep from '@/components/registration/QuestionStep'
  import TermsStep from '@/components/registration/TermsStep'
  import ScheduleStep from '@/components/registration/ScheduleStep'

  import Validator from 'validator'

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
      this.$store.dispatch('getHubs')
  
      API.auth.fetchQuestions(
        (response) => {
          this.release = response.release
          this.questions = response.questions
          this.loadingQuestions = false
        },
        (response) => {
          // TODO: Better handle failed request
          this.$log.error(response)
          this.loadingQuestions = false
        }
      )
    },
    data() {
      return {
        pageStyle: { type: 'registration', visible: false, minimized: false },
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
            answers: {}
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'course', 'hubs', 'user'
      ]),
      sanitizedResponse() {
        return {
          consent: this.response.consent,
          hub_id: this.response.hub_id,
          email: Validator.normalizeEmail(this.response.email),
          age: Validator.toInt(this.response.age),
          lang: this.response.lang,
          registration_info: {
            answers: this.response.registration_info.answers
          }
        }
      },
      validatedResponse() {
        return {
          hub_id: !Validator.isEmpty(this.response.hub_id),
          email: Validator.isEmail(this.response.email),
          age: Validator.isInt(this.response.age, {
            min: 1,
            max: 150
          }),
          lang: !Validator.isEmpty(this.response.lang)
        }
      }
    },
    methods: {
      nextStep() {
        this.currentStep += 1
      },
      previousStep() {
        this.currentStep -= 1
      },
      attemptRegistration() {
        API.auth.register(
          this.sanitizedResponse,
          (response) => {
            this.$store.dispatch('checkAuth')
            this.$router.push('class')
          },
          (response) => {
            this.$log.error(response)
            this.$log.info('Registration failed')
            this.$store.dispatch('checkAuth')
            this.$router.push('class')
          },
        )
      }
    }
  }
</script>
