<template lang="pug">

.fourcorners-submission-wrapper

  .fourcorners-submission.fourcorners-submission-checking(v-if="checkingSubmissions")
    h2 Checking submissions...

  .fourcorners-submission.fourcorners-submission-submitting(v-if="submitting")
    h2 Submitting...

  .fourcorners-submission.fourcorners-submission-submitted(v-if="submitted")
    h2 Thank you for your submission!

  .fourcorners-submission.fourcorners-submission-submit(v-if="isRegistered && !checkingSubmissions && !submitting && !submitted")
    label Submit a link (via Twitter)
    input(type="text" name="text" placeholder="Paste link to webpage with your FourCorners image" v-model="fourcornersLink")
    .pure-button.pure-button-primary.pull-right(v-on:click="postTweet") Submit Homework
    .clearfix

</template>

<script>
import {mapGetters} from 'vuex';
import API from '@/api';
import * as types from '@/store/mutation-types';

export default {
  name: 'four-corners-submission',
  props: ['theClass', 'theContent'],
  mounted() {
    this.checkingSubmissions = true;

    const request = { class: this.theClass, content: this.theContent };

    API.feedback.getFeedbackItems(request,
      (response) =>{
        this.$log.info('Submission check response');
        this.$log.info(response);
        this.checkingSubmissions = false;
        this.submitted = false;// (response.data.length === 0) ? false : true;
      },
      (response) =>{
        this.checkingSubmissions = false;
      });
  },
  data() {
    return {
      fourcornersLink: '',
      checkingSubmissions: true,
      submitting: false,
      submitted: false,
    };
  },
  computed: {
    ...mapGetters([
      'isRegistered',
    ]),
    contentUrl() {
      // return `https://interpretation.connectedacademy.io/#/submission/${this.theClass}/${this.theContent}`;
      return `${window.location.protocol}//${window.location.host}/#/submission/${this.theClass}/${this.theContent}`;
    },
    tweet() {
      return `${this.fourcornersLink} ${this.contentUrl} ${this.$store.getters.course.hashtag}`;
    },
  },
  methods: {
    showAuth() {
      this.$store.commit(types.SHOW_AUTH);
    },
    goToLink(href) {
      this.$router.push(href.replace('/#/markdown','/markdown'));
    },
    postTweet() {

      // Submit
      this.submitting = true;
      this.submitted = false;

      const postData = {
        text: this.tweet,
      };

      API.message.sendMessage(
        postData,
        (response) => {
          this.submitting = false;
          this.submitted = true;
          this.$store.commit(types.SEND_MESSAGE_SUCCESS, { response })
        },
        (response) => {
          alert('Submission failed, please try again.');
          this.submitting = false;
          this.submitted = false;
          this.$store.commit(types.SEND_MESSAGE_FAILURE, { response })
        },
      );
    },
  },
};
</script>

<style lang="stylus">

@import '~stylus/shared'

.fourcorners-submission
  radius(6px)
  background-color $color-dark-grey
  box-sizing()
  overflow hidden
  padding 15px
  width 100%
  &.fourcorners-submission-submit
    label
      color white
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
  &.fourcorners-submission-submitted, &.fourcorners-submission-submitting, &.fourcorners-submission-checking
    text-align center
    h2
      reset()
      color white !important
      padding 40px
  &.fourcorners-submission-submitting, &.fourcorners-submission-checking
    background-color $color-light-grey
    h2
      color $color-text-dark-grey !important
  &.fourcorners-submission-submitted
    background-color $color-success

</style>
