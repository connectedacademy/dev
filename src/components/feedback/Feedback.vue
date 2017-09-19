<template lang="pug">

.feedback-page

  .chat-panel#chat-list-container
    .navigation-button#previous-button(@click="previous")
      icon(name="angle-left")
      p Return to class
    .navigation-button#info-button(@click="currentFeedbackId = undefined")
      icon(name="question")
    .clearfix

    ul
      li.list-header My submissions
      li.no-content(v-if="!myFeedbackItems.length") You have no submissions
      li(v-for="feedbackItem in myFeedbackItems" @click="currentFeedbackId = feedbackItem.id")
        feedback-row(v-bind:content="feedbackItem" v-bind:active="currentFeedbackId === feedbackItem.id")

    ul
      li.list-header Current conversations
      li.no-content(v-if="!myFeedbackItems.length") You are not in any conversations
      li(v-for="feedbackItem in feedbackItems" @click="currentFeedbackId = feedbackItem.id")
        feedback-row(v-bind:content="feedbackItem" v-bind:active="currentFeedbackId === feedbackItem.id")
    ul
      li.list-header Suggested conversations
      li.no-content(v-if="!myFeedbackItems.length") You have no suggestions
      li(v-for="feedbackItem in availableFeedbackItems" @click="currentFeedbackId = feedbackItem.id")
        feedback-row(v-bind:content="feedbackItem" v-bind:active="currentFeedbackId === feedbackItem.id")

    //- ul
      li#random-row
        h1 Want more feedback?
        .pure-button.pure-button-homework Add another student

  .chat-panel#conversation-container

    .main-container.main-container-padded.background-white

      .homework-details(v-if="!currentFeedbackId")
        .homework-banner
          h2 Homework
          p Welcome to the homework area. Think of this as a chat application where each conversation is with another student and conversations are driven by images submitted as homework. Select another student from the list to start a conversation.

        .markdown-wrapper
          markdown-renderer(v-bind:markdown-url="markdownUrl")

        four-corners-link(message="This homework requires the submission of a FourCorners image, we have created a space to learn about FourCorners and what makes it relevant to today's digital photography.")

        four-corners-submission(v-bind:the-class="classSlug" v-bind:the-content="contentSlug")

        #login-notice(v-if="!isRegistered" @click="showAuth") Please login to submit homework

      transition(name="fade" type="in out")
        feedback-view(v-bind:current-feedback-id="currentFeedbackId" v-bind:currentFeedbackId.sync="currentFeedbackId")

  .clearfix

</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

import API from '@/api';
import * as types from '@/store/mutation-types';
import Auth from '@/mixins/Auth';

import MarkdownRenderer from '@/components/MarkdownRenderer';
import FourCornersSubmission from '@/components/fourcorners/FourCornersSubmission';
import FourCornersLink from '@/components/fourcorners/FourCornersLink';
import PreviousButton from '../PreviousButton';
import FeedbackTile from './FeedbackTile';
import FeedbackRow from './FeedbackRow';
import FeedbackView from './FeedbackView';
import InfoDialogue from '../InfoDialogue';

export default {
  name: 'feedback',
  mixins: [
    Auth,
  ],
  components: {
    MarkdownRenderer,
    FourCornersSubmission,
    FourCornersLink,
    PreviousButton,
    InfoDialogue,
    FeedbackTile,
    FeedbackRow,
    FeedbackView,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.dispatch('checkAuth');
      vm.$store.commit(types.SET_NAV_STATE, { minimized: true });
      vm.$store.commit(types.SET_PAGE_STYLE, 'chat');
    });
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit(types.SET_NAV_STATE, { minimized: false });
    this.$store.commit(types.SET_PAGE_STYLE, undefined);
    next();
  },
  created() {
    // Check if user has registered
    if (this.isAuthenticated && !this.isRegistered) {
      this.$router.push('/registration');
    }
  },
  mounted() {
    // Fetch feedback items
    this.getFeedbackItems();
    this.getAvailableFeedbackItems();

    var self = this;

    this.$io.socket.on('user', function(obj) {
      console.log('Submission message received');
      console.log(obj);
      switch (obj.data.msgtype) {
        case 'submission':

          self.getFeedbackItems();
          self.getAvailableFeedbackItems();

          break;
        default:
      }
    });
  },
  data() {
    return {
      navTitle: 'Connected Academy - Feedback',
      myFeedbackItems: [],
      feedbackItems: [],
      availableFeedbackItems: [],
      currentFeedbackId: '',
    };
  },
  methods: {
    previous() {
      return this.$router.go(-1);
    },
    getFeedbackItems() {
      
      if (!this.classSlug || !this.contentSlug) { return }

      const request = { class: this.classSlug, content: this.contentSlug };
      API.feedback.getFeedbackItems(
        request,
        (response) => {
          this.$log.info('Response from feedback request');
          this.$log.info(response);
          var self = this;
          this.myFeedbackItems = _.filter(response.data, function(item) {
            return item.user.account_number === self.user.account_number;
          });
          this.feedbackItems = _.filter(response.data, function(item) {
            return item.user.account_number !== self.user.account_number;
          });
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.info('Failed to retrieve feedback');
        },
      );
    },
    getAvailableFeedbackItems() {
      const request = { class: this.classSlug, content: this.contentSlug };
      API.feedback.getAvailableFeedbackItems(
        request,
        (response) => {
          this.$log.info('Response from feedback request (available)');
          this.$log.info(response);
          this.availableFeedbackItems = response.data;
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.info('Failed to retrieve feedback');
        },
      );
    },
  },
  computed: {
    ...mapGetters([
      'isAuthenticated', 'isRegistered', 'user', 'currentClass', 'course',
    ]),
    classSlug() {
      return this.$route.params.classSlug;
    },
    contentSlug() {
      return this.$route.params.contentSlug;
    },
    markdownUrl() {
      return `${this.course.baseUri}class1/${this.contentSlug}.md`;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/feedback'

$chat-list-width = 320px

.feedback-page
  background-color $color-lightest-grey

.chat-panel
  float left
  min-height 100%
  overflow-x none
  overflow-y auto

#chat-list-container
  pinned()
  background-color $color-lightest-grey
  border-right $color-lighter-grey 1px solid
  box-sizing()
  overflow scroll
  position absolute
  right auto
  width $chat-list-width
  @media(max-width: 600px)
    width 75px

  .navigation-button
    animate()
    background-color white
    box-sizing()
    float left
    height 50px
    &:hover
      background-color $color-lightest-grey
      cursor pointer

    p
      reset()
      font-size 0.9em
      line-height 54px

    .fa-icon
      color $color-text-dark-grey
      height 50px
      position absolute
      margin 0 20px
      width 10px

    &#info-button
      border-left $color-light-grey 1px solid
      width 50px
    &#previous-button
      padding-left 50px
      width calc(100% - 50px)
      .fa-icon
        left 0

    @media(max-width: 600px)
      max-width 50% !important
      width 50% !important
      padding 0 !important
      .fa-icon
        margin 0 12px
      p
        display none


  ul
    cleanlist()
    &:last-child
      border-bottom $color-lighter-grey 1px solid
    li
      cleanlist()
      border-top $color-lighter-grey 1px solid
      &.list-header
        color $color-text-grey
        font-size 0.9em
        padding 20px 10px 5px 10px
        @media(max-width: 600px)
          display none
      &.no-content
        border-top none
        color $color-text-light-grey
        line-height 20px
        padding 10px 10px 50px 10px
        text-align left
      &#random-row
        /*background-color white*/
        border-top $color-lighter-grey 1px solid
        padding 10px 20px
        text-align center
        h1
          color $color-text-dark-grey
          font-size 1em

#conversation-container
  pinned()
  background-color white
  border-right $color-lighter-grey 1px solid
  left $chat-list-width
  position absolute
  max-width 780px
  @media(max-width: 600px)
    left 75px

.feedback-section
  margin-bottom 30px
  h1.feedback-section-title
    reset()
    padding 0 10px
  h5.feedback-section-subtitle
    reset()
    color $color-text-grey
    padding 0 10px
    margin-bottom 10px

.homework-details

  .homework-banner
    radius(6px)
    background-color $color-homework
    margin-bottom 15px
    padding 20px
    h2
      reset()
      color white
    p
      reset()
      color white

  .markdown-wrapper
    padding 5px

#login-notice
  radius(4px)
  background-color $color-homework
  color white
  padding 30px
  text-align center
</style>
