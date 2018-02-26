<template lang="pug">

.feedback-submission-wrapper(v-if="isRegistered")

  .feedback-submission.feedback-submission-submit
    label
      | Search your site for a FourCorners image
    input(type="text" name="text" placeholder="E.g. https://example.com/page" v-model="submissionLink")
    p.pull-left {{ resultsText }}
    .pure-button.pure-button-primary.pull-right(v-on:click="postSubmission") Begin Search
    .clearfix
  
  ul.submission-selector(v-if="submissions.length > 0")
    li(v-for="(submission, index) in submissions" v-bind:key="index" @click="verifySubmission(submission.id)" v-bind:style="{ 'background-image': submissionSrc(submission.id) }")
    .clearfix

</template>

<script>
import { mapGetters } from 'vuex';
import API from '@/api';
import * as types from '@/store/mutation-types';

export default {
  name: 'feedback-submission',
  props: ['theClass', 'theContent'],
  data() {
    return {
      submissionLink: '',
      resultsText: '',
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
      return `url(https://api.connectedacademy.io/v1/discussion/thumbnail/${submissionId.replace('#','%23')})`
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
          this.$log.debug(response)
          this.$emit('reloadchats')
        },
        (response) => {
          this.$log.error(response)
          this.$log.info('Submission verification failed')
          alert('Submission verification failed, please try again.')
        }
      )
    },
    postSubmission() {
      // Submit

      this.resultsText = 'Searching...';

      const postData = {
        class: this.theClass,
        content: this.theContent,
        url: this.submissionLink,
      };

      API.feedback.postSubmission(
        postData,
        (response) => {
          this.submissions = response.body.submissions;
          this.resultsText = (this.submissions.length) ? `Select an Image` : 'No Images Found';
        },
        (response) => {
          this.$log.error(response)
          this.$log.info('Submission failed')
          alert('Submission failed, please try again.');
          this.resultsText = '';
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

.feedback-submission-wrapper
  radius(6px)
  box-sizing()
  background-color $color-homework
  overflow hidden
  width 100%
  .feedback-submission
    padding 15px
    &.feedback-submission-submit
      label
        color white
        svg
          margin 0 5px
      p
        reset()
        color white
        line-height 40px
        margin-top 10px
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

  ul.submission-selector
    cleanlist()
    background-color alpha(black, 0.2)
    margin-top 5px
    padding 10px
    li
      cleanlist()
      background-image()
      float left
      height 140px
      margin 10px
      opacity 0.8
      width 200px
      &:hover
        cursor pointer
        opacity 1.0
        outline white 3px solid


</style>
