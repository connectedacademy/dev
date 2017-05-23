<template lang="pug">

  .col#col-main.background-white(v-bind:class="this.$store.state.layout.columns.main.state")

    previous-button

    .container

      info-dialogue(:dismissable="true")
        p Welcome to the feedback screen, here you can give feedback on the image below

      .feedback-section

        h1.feedback-section-title Give Feedback
        h5.feedback-section-subtitle Please provide feedback on the following image

        .feedback-tile(v-if="feedbackItem")

          four-corners(v-bind:html="feedbackItem.html")

          .user-strip
            img.user-profile-image(v-bind:src="feedbackItem.user.profile")
            h5.user-profile-name {{ feedbackItem.user.name }}

      .feedback-conversation
        .feedback-message-wrapper(v-for="message in feedbackMessages")
          .feedback-message.animated.fadeInUp(v-bind:class="{ reply: (message.fromuser.name !== 'Edward Jenkins') }")
            .feedback-message--bubble
              p(v-if="!message.canview") Message hidden
              p(v-if="message.canview") {{ message.message }}
            .feedback-message--author
              p by {{ message.fromuser.name }}
          .clearfix

        .feedback-submission
          textarea(v-autosize="comment" placeholder="Write comment..." v-model="comment"  @keyup.enter="postFeedbackComment")
          .pure-button.pure-button-primary(@click="postFeedbackComment") Comment
          .clearfix

</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

import API from '@/api';
import * as types from '@/store/mutation-types';

import FourCorners from '../fourcorners/FourCorners';

import PreviousButton from '../PreviousButton';
import InfoDialogue from '../InfoDialogue';

export default {
  name: 'feedback-view',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.dispatch('checkAuth');
    });
  },
  created() {
    // Check if user has registered
    if (this.isAuthenticated && !this.isRegistered) {
      this.$router.push('/registration');
    }
  },
  mounted() {
    this.$store.dispatch('setColumnState', 'narrow');

    // Fetch feedback item
    this.getFeedbackItem();
    this.getDiscussion();
  },
  data() {
    return {
      navTitle: 'Connected Academy - View Feedback',
      feedbackItem: undefined,
      discussion: [],
      comment: '',
    };
  },
  methods: {
    previous() {
      this.$router.go(-1);
    },
    postFeedbackComment() {
      let message = { reply: false, text: this.comment, user: { name: 'You' } };

      const request = { text: this.comment, id: this.encodedContentId };

      API.feedback.postFeedbackMessage(
        request,
        (response) => {
          this.$log.log('Response from feedback request');
          this.$log.log(response);
          this.comment = '';
          this.getDiscussion();
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.log('Failed to retrieve feedback');
        },
      );
    },
    getDiscussion() {

      const request = { id: this.encodedContentId };

      API.feedback.getDiscussion(
        request,
        (response) => {
          this.$log.log('Response from feedback request');
          this.$log.log(response);
          this.discussion = response;
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.log('Failed to retrieve feedback');
        },
      );
    },
    getFeedbackItem() {

      const request = { id: this.encodedContentId };

      API.feedback.getFeedbackItem(
        request,
        (response) => {
          this.$log.log('Response from feedback request');
          this.$log.log(response);
          this.feedbackItem = response;
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.log('Failed to retrieve feedback');
        },
      );
    },
  },
  computed: {
    ...mapGetters([
      'isAuthenticated', 'isRegistered',
    ]),
    feedbackMessages() {
      return _.orderBy(this.discussion, ['createdAt'], ['asc']);
    },
    encodedContentId() {
      return this.$route.params.id.replace('#','%23');
    },
  },
  components: {
    PreviousButton,
    InfoDialogue,
    FourCorners,
  },
};
</script>

<style lang="stylus" scoped>

@import '../../assets/stylus/shared/*'

.feedback-section
  margin-bottom 30px
  h1.feedback-section-title
    nomargin()
    nopadding()
    padding 0 10px
  h5.feedback-section-subtitle
    nomargin()
    nopadding()
    color $color-text-grey
    padding 0 10px
    margin-bottom 10px

  .feedback-tile
    cleanlist()
    margin 10px

    .user-strip
      padding-left 60px
      position relative

      img.user-profile-image
        radius(50%)
        height 50px
        width 50px
        position absolute
        top 5px
        left 5px

      h5.user-profile-name
        nomargin()
        height 60px
        line-height 60px
        padding 0 10px

.feedback-conversation
  padding 10px

  .feedback-message
    display inline-block
    float right
    margin-bottom 10px
    .feedback-message--bubble
      radius(6px)
      background-color $color-primary
      padding 6px 12px
      p
        nomargin()
        nopadding()
        color white
    .feedback-message--author
      text-align right
      p
        nomargin()
        nopadding()
        padding 4px 0
        color $color-text-grey
        font-size 0.7em
    &.reply
      float left
      .feedback-message--bubble
        radius(6px)
        background-color $color-light-grey
        p
          color $color-text-dark-grey

  .feedback-submission
    radius(6px)
    border $color-light-grey 1px solid
    padding 10px
    textarea
      border none
      display block
      outline 0
      resize none
      height 20px
      line-height 20px
      width 100%
    .pure-button
      float right
</style>
