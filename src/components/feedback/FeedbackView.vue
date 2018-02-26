<template lang="pug">

  .feedback-view(v-if="currentFeedbackId && feedbackItem")

    .feedback-section

      .feedback-tile(v-if="feedbackItem && feedbackItem.html")
        //- a.pure-button.pure-button-subtle.pull-left(v-if="feedbackItem.original" v-bind:href="feedbackItem.original" target="_blank" alt="View original submission") View original
        .pure-button.pure-button-subtle.pull-left(v-if="isOwner" @click="removeSubmission" alt="Delete submission") Delete
        .pure-button.pure-button-subtle.pull-left(v-else @click="navigateTo(feedbackItem.original)" alt="View original submission") View submission
        .pure-button.pure-button-subtle.pull-right(@click="closeSubmission" alt="Close") Close
        //- pre {{ feedbackItem }}
        .clearfix

        br

        four-corners(v-bind:html="feedbackItem.html")

    .feedback-conversation
      .feedback-message-wrapper(v-for="message in feedbackMessages")
        .feedback-message.animated.fadeInUp(@click="unlockMessage(message)" v-bind:class="{ locked: (!message.canview), reply: (message.fromuser.id !== user.id) }")
          a(v-bind:href="`https://twitter.com/${message.fromuser.account}`" target="_blank")
            img.avatar(v-bind:src="message.fromuser.profile")
          .feedback-message--bubble
            p(v-if="!message.canview")
              i.fas.fa-lock(style="height: 12px;margin: 0 7px 0 0")
              | Message locked (click here)
            p(v-if="message.canview") {{ message.message }}
            .feedback-message--action(@click="reportItem(message.id)")
              i.fas.fa-ellipsis-h
            .clearfix
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
import API from '@/api'
import { mapGetters } from 'vuex'

import orderBy from 'lodash/orderBy'

import FourCorners from '@/components/fourcorners/FourCorners'
import InfoDialogue from '@/components/InfoDialogue'

import Report from '@/mixins/Report'

export default {
  name: 'feedback-view',
  props: ['currentFeedbackId', 'discussion', 'classSlug', 'contentSlug'],
  mixins: [Report],
  components: {
    InfoDialogue,
    FourCorners,
  },
  watch: {
    currentFeedbackId() {
      // Fetch feedback item
      this.getFeedbackItem()
    },
    feedbackItem() {
      // Set loading state
      this.loading = true
      // Clear discussion
      this.$emit('update:discussion', [])
      // Fetch discussion
      this.getDiscussion()
    }
  },
  data() {
    return {
      navTitle: 'Connected Academy - View Feedback',
      loading: true,
      feedbackItem: undefined,
      comment: ''
    }
  },
  computed: {
    ...mapGetters([
      'isRegistered', 'user'
    ]),
    isOwner() {
      return (this.user && (this.user.account === this.feedbackItem.user.account))
    },
    feedbackMessages() {
      return orderBy(this.discussion, ['createdAt'], ['asc'])
    },
    encodedContentId() {
      if (!this.currentFeedbackId) {
        return undefined
      } else {
        return this.currentFeedbackId.replace('#','%23')
      }
    },
  },
  methods: {
    navigateTo(location) {
      document.location = location
    },
    closeSubmission() {
      this.$emit('update:currentFeedbackId', undefined)
    },
    removeSubmission() {
      const postData = {
        id: this.encodedContentId
      }
      API.feedback.removeSubmission(
        postData,
        (response) => {
          this.$log.info('Response from remove submission request')
          this.$log.info(response)
          this.$emit('update:currentFeedbackId', undefined)
          this.$emit('reloadchats')
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.error(response)
          this.$log.info('Failed to remove submission')
        },
      )
    },
    unlockMessage(message) {
      if (!message.canview) {
        
        this.$store.commit('SHOW_INFO_MODAL', { title: 'Locked', body: `Please leave feedback on ${message.fromuser.name}'s submission to view their comments on your images`, action: this.$t('submission.view_submission') })

        // Redirect to other user's feedback

        const request = {
          classSlug: this.classSlug,
          contentSlug: this.contentSlug,
          userId: message.fromuser.id.replace('#', '%23')
        }
        API.feedback.getUserSubmissions(
          request,
          (response) => {
            this.$log.info('Response from user submissions request')
            this.$log.info(response)
            const feedbackId = response.body[0].id
            this.$emit('update:currentFeedbackId', feedbackId)
            
          },
          (response) => {
            // TODO: Handle failed request
            this.$log.error(response)
            this.$log.info('Failed to user submissions')
          }
        )
      }
    },
    postFeedbackComment() {

      let message = { reply: false, text: this.comment, user: { name: 'You' } }

      const request = { text: this.comment, id: this.encodedContentId }

      API.feedback.postFeedbackMessage(
        request,
        (response) => {
          this.$log.info('Response from feedback request')
          this.$log.info(response)
          this.comment = ''
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.error(response)
          this.$log.info('Failed to retrieve feedback')
        },
      )
    },
    getDiscussion() {
      const request = { id: this.encodedContentId }

      API.feedback.getDiscussion(
        request,
        (response) => {
          this.$log.info('Response from feedback request')
          this.$log.info(response)
          this.$emit('update:discussion', response)
          // Set loading state
          this.loading = false
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.error(response)
          this.$log.info('Failed to retrieve feedback')
          // Set loading state
          this.loading = false
        },
      )
    },
    getFeedbackItem() {

      const request = { id: this.encodedContentId }

      API.feedback.getFeedbackItem(
        request,
        (response) => {
          this.$log.info('Response from feedback request')
          this.$log.info(response)
          this.feedbackItem = response
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.error(response)
          this.$log.info('Failed to retrieve feedback')
        },
      )
    },
  },
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

.feedback-section

  .feedback-tile
    cleanlist()

    // a#view-submission-link
    //   color $color-text-grey
    //   text-decoration none

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
  position relative

  .feedback-message-wrapper
    .feedback-message
      display inline-block
      float right
      margin-bottom 10px
      padding-right 40px
      position relative
      img.avatar
        radius(50%)
        height 34px
        position absolute
        top 0
        right 0
      .feedback-message--bubble
        animate()
        radius(17px)
        background-color $color-homework
        padding 6px 12px
        padding-right 35px
        p
          animate()
          reset()
          color white

        .feedback-message--action
          opacity 0.0
          padding 5px
          position absolute
          bottom 30px
          left -30px
          height 14px
          svg
            color grey
            cursor pointer
        &:hover
          .feedback-message--action
            opacity 1
      .feedback-message--author
        position relative
        text-align right
        p
          reset()
          padding 4px 0
          color $color-text-grey
          font-size 0.7em
      &.reply
        float left
        padding-right 0px
        padding-left 40px
        img.avatar
          right auto
          left 0
        .feedback-message--bubble
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
        padding 20px 0
        width calc(100% - 120px)
      .pure-button
        background-color $color-homework
        border-color $color-homework
        color white
        float right
        margin 10px 0
        &:hover
          background-color darken($color-homework, 10%)
</style>
