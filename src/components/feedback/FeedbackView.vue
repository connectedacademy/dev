<template lang="pug">

  .feedback-view(v-if="currentFeedbackId && feedbackItem")

    .feedback-header
      p {{ feedbackItem.user.name }} - {{ currentFeedbackId }}

    .feedback-section

      .feedback-tile(v-if="feedbackItem && feedbackItem.html")
        four-corners(v-bind:html="feedbackItem.html")

    .feedback-conversation
      .feedback-message-wrapper(v-for="message in feedbackMessages")
        .feedback-message.animated.fadeInUp(@click="unlockMessage(message)" v-bind:class="{ locked: (!message.canview), reply: (message.fromuser.id !== currentUser.id) }")
          .feedback-message--bubble
            p(v-if="!message.canview")
              icon(name="lock" style="height: 12px;margin: 0 7px 0 0")
              | Message locked (click here)
            p(v-if="message.canview") {{ message.message }}
          .feedback-message--author
            p by {{ message.fromuser.name }}
        .clearfix

      .feedback-submission
        textarea(v-autosize="comment" placeholder="Leave some feedback..." v-model="comment" @keydown.enter.prevent.stop="postFeedbackComment")
        .feedback-submission--footer
          .pure-button(v-on:click="postFeedbackComment") Send
          p.feedback-submission-note Your comments are private and will not be posted to Twitter.
          .clearfix
      .clearfix


    .clearfix

</template>

<script>
import API from '@/api';
import { mapGetters } from 'vuex';

import orderBy from 'lodash/orderBy';

import FourCorners from '@/components/fourcorners/FourCorners';
import InfoDialogue from '@/components/InfoDialogue';

import 'vue-awesome/icons/lock';

export default {
  name: 'feedback-view',
  props: ['currentFeedbackId', 'discussion', 'classSlug', 'contentSlug'],
  components: {
    InfoDialogue,
    FourCorners,
  },
  watch: {
    currentFeedbackId() {
      // Fetch feedback item
      this.getFeedbackItem();
    },
    feedbackItem() {
      // Set loading state
      this.loading = true;
      // Clear discussion
      this.$emit('update:discussion', []);
      // Fetch discussion
      this.getDiscussion();
    }
  },
  data() {
    return {
      navTitle: 'Connected Academy - View Feedback',
      loading: true,
      feedbackItem: undefined,
      comment: '',
    };
  },
  methods: {
    previous() {
      this.$router.go(-1);
    },
    unlockMessage(message) {
      if (!message.canview) {
        
        this.$store.commit('SHOW_INFO_MODAL', { title: 'Locked', body: `Please leave feedback on ${message.fromuser.name}'s submission to view their comments on your images`, action: this.$t('submission.view_submission') });

        // Redirect to other user's feedback

        const request = {
          classSlug: this.classSlug,
          contentSlug: this.contentSlug,
          userId: message.fromuser.id.replace('#', '%23')
        };
        API.feedback.getUserSubmissions(
          request,
          (response) => {
            this.$log.info('Response from user submissions request');
            this.$log.info(response);
            const feedbackId = response.body[0].id;
            this.$emit('update:currentFeedbackId', feedbackId)
            
          },
          (response) => {
            // TODO: Handle failed request
            this.$log.info('Failed to user submissions');
          },
        );
      }
    },
    postFeedbackComment() {

      let message = { reply: false, text: this.comment, user: { name: 'You' } };

      const request = { text: this.comment, id: this.encodedContentId };

      API.feedback.postFeedbackMessage(
        request,
        (response) => {
          this.$log.info('Response from feedback request');
          this.$log.info(response);
          this.comment = '';
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.info('Failed to retrieve feedback');
        },
      );
    },
    getDiscussion() {
      const request = { id: this.encodedContentId };

      API.feedback.getDiscussion(
        request,
        (response) => {
          this.$log.info('Response from feedback request');
          this.$log.info(response);
          this.$emit('update:discussion', response);
          // Set loading state
          this.loading = false;
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.info('Failed to retrieve feedback');
          // Set loading state
          this.loading = false;
        },
      );
    },
    getFeedbackItem() {

      const request = { id: this.encodedContentId };

      API.feedback.getFeedbackItem(
        request,
        (response) => {
          this.$log.info('Response from feedback request');
          this.$log.info(response);
          this.feedbackItem = response;
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
      'isRegistered',
    ]),
    feedbackMessages() {
      return orderBy(this.discussion, ['createdAt'], ['asc']);
    },
    encodedContentId() {
      if (!this.currentFeedbackId) {
        return undefined;
      } else {
        return this.currentFeedbackId.replace('#','%23');
      }
    },
    currentUser() {
      return this.$store.getters.user;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

.feedback-view
  padding-top 50px

  .feedback-header
    pinned()
    background-color white
    border-bottom $color-border 1px solid
    height 50px
    position absolute
    text-align center
    bottom auto
    p
      reset()
      font-size 0.9em
      line-height 54px

.feedback-section
  h1.feedback-section-title
    reset()
    padding 0 10px
  h5.feedback-section-subtitle
    reset()
    color $color-text-grey
    padding 0 10px
    margin-bottom 10px

  .feedback-tile
    cleanlist()

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
        reset()
        height 60px
        line-height 60px
        padding 0 10px

.feedback-conversation
  padding-top 20px
  padding-bottom 60px

  .feedback-message-wrapper
    .feedback-message
      display inline-block
      float right
      margin-bottom 10px
      .feedback-message--bubble
        animate()
        radius(6px)
        background-color $color-homework
        padding 6px 12px
        p
          animate()
          reset()
          color white
      .feedback-message--author
        text-align right
        p
          reset()
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
        .feedback-message--author
          text-align left
      &.locked
        &:hover
          cursor pointer
          .feedback-message--bubble
            background-color $color-homework
            p
              color white

  .feedback-submission
    background-color $color-lightest-grey
    border $color-light-grey 1px solid
    padding 10px
    textarea
      background-color transparent
      border none
      display block
      font-size 1em
      outline 0
      resize none
      min-height 60px
      width 100%
    .feedback-submission--footer
      pinned()
      background white
      border-top $color-border 1px solid
      height 60px
      position absolute
      top auto
      p.feedback-submission-note
        reset()
        box-sizing()
        color $color-text-grey
        float left
        font-size 0.9em
        line-height 20px
        padding 20px 20px
        width calc(100% - 12gc ''0px)
      .pure-button
        background-color $color-homework
        border-color $color-homework
        color white
        float right
        margin 10px 20px
        &:hover
          background-color darken($color-homework, 10%)
</style>
