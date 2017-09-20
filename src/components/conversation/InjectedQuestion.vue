<template lang="pug">

.course-content#wrapper.hidden(ref="question" v-if="isRegistered && !hidden")

  .course-content--header
    h1.content-title Question

  .course-content--body.animated.fadeIn(v-if="question && !question.alreadyanswered")
    p.content-description {{ question.text }}

    .vue-slider-wrapper(v-if="question.response_type === 'scale'")
      vue-slider(v-bind:min="0" v-bind:max="5" v-bind:tooltip-style="{ 'background-color': '#0078E7', 'border-top-color': '#0078E7' }" v-bind:bg-style="{ 'background-color': '#d9d9d9' }" v-bind:process-style="{ 'background-color': '#d9d9d9' }" ref="slider" v-model="answer")

    input.full-width(v-model="answer" v-if="question.response_type === 'text'" type="text")

    input.full-width(v-model="answer" v-if="question.response_type === 'boolean'" type="checkbox")

  .course-content--footer
    .pure-button.pure-button-subtle.pure-button-text(@click="hidden = true") Maybe later
    .pure-button.pull-right(@click="postAnswer") Answer

</template>

<script>
import _ from 'lodash/core';
import {mapGetters} from 'vuex';
import API from '@/api';
import VueSlider from 'vue-slider-component';

export default {
  name: 'injected-question',
  components: {
    VueSlider,
  },
  props: ['slug'],
  data() {
    return {
      hidden: false,
      question: undefined,
      answer: undefined,
    };
  },
  computed: {
    ...mapGetters([
      'currentClass', 'isRegistered',
    ]),
  },
  mounted() {
    // Get question
    const request = { theClass: this.currentClass.slug, slug: this.slug };

    API.question.getQuestion(
      request,
      (response) => {
        this.$log.info(response);
        this.question = response;
      },
      (response) => {
        // TODO: Handle failed request
        this.$log.info('Failed to retrieve question');
      },
    );
  },
  methods: {
    postAnswer() {
      // Post answer
      const request = {
        class: this.currentClass.slug,
        content: this.slug,
        question_id: this.question.id,
        answer: this.answer,
      };

      API.question.postAnswer(
        request,
        (response) => {
          this.hidden = true;
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.info('Failed to post answer');
        },
      );
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/layout/course-content'

#wrapper
  animate()

fieldset
  border none
  input, select
    border-color $color-danger
  &.valid
    input, select
      border-color $color-success

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

</style>
