<template lang="pug">
  
.survey-page(name="markdown-page")

  .col#col-main.narrow

    .main-container

      .container

        .survey-step.content-block.white-block.padded-block(v-if="currentStep === 0")
          h1 A few questions
          p Thankyou for completing the course, before we can issue your certificate we need to ask a few questions.
          .pure-button.pure-button-info.rounded-tall(@click="nextStep") Get Started

        .survey-step(v-for="(question, index) in postQuestions" v-bind:key="index")
          question-step(v-if="currentStep === (index + 1)" v-bind:answers.sync="answers" v-bind:question.sync="question" v-on:nextStep="nextStep" v-on:previousStep="previousStep")

        .survey-step.content-block.white-block.padded-block(v-if="currentStep === (postQuestions.length + 1)")
          img(height="100px" src="../../assets/icons/certificate.svg")
          h1 Thanks for answering!
          p Your interest in certification has been recorded. We will contact you shortly on the following email:
          p {{ user.email }}
          router-link.pure-button.pure-button-info.rounded-tall(v-bind:to="{ name: 'course' }") Return to Course
</template>

<script>
import API from '@/api'
import { mapGetters } from 'vuex'
import _take from 'lodash/take'

// Components
import QuestionStep from '@/components/registration/QuestionStep';

// Mixins
import PageStyle from '@/mixins/PageStyle';

export default {
  name: 'survey-page',
  mixins: [PageStyle],
  components: {
    QuestionStep
  },
  watch: {
    currentStep(nV) {
      if (nV === this.postQuestions.length + 1) {
        this.submitAnswers()
      }
    }
  },
  data() {
    return {
      pageStyle: { type: 'survey', minimized: true },
      currentStep: 0,
      answers: {},
      questions: [],
      loadingQuestions: true
    }
  },
  computed: {
    ...mapGetters(['user']),
    postQuestions() {
      return _take(this.questions, 3)
    }
  },
  mounted() {
    
    this.loadQuestions()
  },
  methods: {
    nextStep() {
      this.currentStep += 1
    },
    previousStep() {
      this.currentStep -= 1
    },
    loadQuestions() {
      // Fetch post course questions
      API.question.getPostCourseQuestions(
        (response) => {
          this.release = response.release;
          this.questions = response;
          this.loadingQuestions = false;
        },
        (response) => {
          // TODO: Better handle failed request
          this.loadingQuestions = false;
        }
      )
    },
    submitAnswers() {
      for (const key in this.answers) {
        const postData = {
          class: 'POST_COURSE_RESPONSE',
          content: 'POST_COURSE_RESPONSE',
          question_id: key,
          answer: (this.answers[key]) ? this.answers[key] : 'NO ANSWER'
        }

        API.question.postAnswer(
          postData,
          (response) => {
            console.log(response)
          },
          (response) => {
            // TODO: Better handle failed request
            this.savingAnswers = false
            console.log(response)
          }
        )
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.survey-page
  text-align center
  .survey-step
    radius(6px)
    margin 0
    .content-block
      margin 0 !important
</style>
