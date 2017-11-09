<template lang="pug">

.feedback-submission-wrapper(v-if="isRegistered")

  //- .feedback-submission.feedback-submission-checking(v-if="checkingSubmissions")
  //-   h2 Checking submissions...

  //- .feedback-submission.feedback-submission-submitting(v-if="submitting")
  //-   h2 Submitting...

  //- .feedback-submission.feedback-submission-submitted(v-if="submitted")
  //-   h2 Thank you for your submission!

  .feedback-submission.feedback-submission-submit
    label
      | Paste a link to your FourCorners image - https://demo.fourcorners.io
    input(type="text" name="text" placeholder="E.g. https://example.com/page" v-model="submissionLink")
    .pure-button.pure-button-primary.pull-right(v-on:click="postSubmission") Find Images
    .clearfix

  ul.submission-selector
    li(v-for="(submission, index) in submissions" v-bind:key="index" @click="verifySubmission(submission.id)")
      img(v-bind:src="submissionSrc(submission.id)" height="100")
      p {{ submission.id }}
    .clearfix

</template>

<script>
import {mapGetters} from 'vuex';
import API from '@/api';
import * as types from '@/store/mutation-types';

export default {
  name: 'feedback-submission',
  props: ['theClass', 'theContent'],
  data() {
    return {
      submissionLink: '',
      checkingSubmissions: true,
      submitting: false,
      submitted: false,
      submissions: []
    };
  },
  computed: {
    ...mapGetters([
      'isRegistered',
    ])
  },
  methods: {
    submissionSrc(submissionId) {
      return `https://api.connectedacademy.io/v1/discussion/thumbnail/${submissionId.replace('#','%23')}`
    },
    showAuth() {
      this.$store.commit(types.SHOW_AUTH);
    },
    goToLink(href) {
      this.$router.push(href.replace('/#/markdown','/markdown'));
    },
    verifySubmission(submissionId) {
      const postData = {
        submission: submissionId.replace('#','%23')
      }

      API.feedback.verifySubmission(
        postData,
        (response) => {
          alert('Submission verified.')
          this.$emit('reloadchats')
        },
        (response) => {
          alert('Submission verification failed, please try again.')
        }
      )
    },
    postSubmission() {
      // Submit
      this.submitting = true;
      this.submitted = false;

      const postData = {
        class: this.theClass,
        content: this.theContent,
        url: this.submissionLink,
      };

      API.feedback.postSubmission(
        postData,
        (response) => {
          this.submitting = false;
          this.submitted = true;
          this.submissions = response.body.submissions;
        },
        (response) => {
          alert('Submission failed, please try again.');
          this.submitting = false;
          this.submitted = false;
          this.submissions = [];
        }
      )
    }
  }
}
</script>

<style lang="stylus">

@import '~stylus/shared'
@import '~stylus/buttons'

.feedback-submission
  radius(6px)
  box-sizing()
  background-color $color-homework
  overflow hidden
  padding 15px
  width 100%
  &.feedback-submission-submit
    label
      color white
      .fa-icon
        margin 0 5px
    p
      reset()
      color white
    input[type="text"]
      radius(6px)
      box-sizing()
      border none
      box-shadow none
      line-height 40px
      margin 10px 0
      padding 0 10px
      outline 0
      resize none
      width 100%
    .pure-button
      background-color transparent
      border white 1px solid
      color white
      margin-top 10px
      &:hover
        background-color white
        border-color white
        color $color-darkest-grey
  &.feedback-submission-submitted, &.feedback-submission-submitting, &.feedback-submission-checking
    text-align center
    h2
      reset()
      color white !important
      padding 40px
  &.feedback-submission-submitting, &.feedback-submission-checking
    background-color $color-light-grey
    h2
      color $color-text-dark-grey !important
  &.feedback-submission-submitted
    background-color $color-success

ul.submission-selector
  cleanlist()
  li
    cleanlist()
    float left
    margin 10px

</style>
