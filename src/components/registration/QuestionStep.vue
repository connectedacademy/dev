<template lang="pug">

  .registration-page.question-step

    .content-block.white-block.question-block(v-for="(question, index) in theQuestions")

      previous-button(v-on:previousStep="$emit('previousStep')")

      form.pure-form.pure-form-stacked
        
        scale-response(v-if="question.response_type === 'scale'" v-bind:label="question.text" v-model="response.registration_info.answers[question.id]" v-bind:min="question.response_min" v-bind:max="question.response_max")
        text-response(v-if="question.response_type === 'text'" v-bind:label="question.text" v-model="response.registration_info.answers[question.id]" v-bind:placeholder="question.response_placeholder ? question.response_placeholder : 'Please answer here...'")
        multi-response(v-if="question.response_type === 'multi'" v-bind:label="question.text" v-model="response.registration_info.answers[question.id]" v-bind:options="question.response_options" v-on:answered="$emit('nextStep')")

        .pure-button.pure-button-info.rounded-short(@click="$emit('nextStep')" v-if="question.response_type !== 'multi'") {{ $t('common.continue') }}
        
        .clearfix

</template>

<script>
  import PreviousButton from '@/components/registration/PreviousButton';
  import ScaleResponse from '@/components/registration/ScaleResponse';
  import TextResponse from '@/components/registration/TextResponse';
  import MultiResponse from '@/components/registration/MultiResponse';

  export default {
    name: 'question-step',
    props: ['question', 'questions', 'response', 'formIsValid'],
    components: {
      PreviousButton,
      ScaleResponse,
      TextResponse,
      MultiResponse,
    },
    computed: {
      theQuestions() {
        return (!this.question) ? this.questions : [this.question]
      }
    }
  }
</script>

<style lang="stylus" scoped>

@import '~stylus/registration'

.registration-page.question-step
  margin 0 auto
  max-width 400px
  position relative
  text-align center

  .pure-button
    margin-top 20px

  .question-block
    padding-top 40px

    label
      padding 0 30px

</style>
