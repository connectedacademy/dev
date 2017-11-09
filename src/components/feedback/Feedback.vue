<template lang="pug">

.feedback-page(name="feedback-page")
  
  page-header(title="Homework Area" identifier="homework")

  #chat-list-container
    ul
      li.list-header My submissions
      li.no-content(v-if="!myFeedbackItems.length") Your conversations will appear here when you submit homework.
      router-link(v-for="(feedbackItem, index) in myFeedbackItems" v-bind:key="index" @click="currentFeedbackId = feedbackItem.id" v-bind:to="{ name: 'feedback_view', params: { classSlug: classSlug, contentSlug: contentSlug, id: encodedId(feedbackItem.id) }}" tag="li")
        feedback-row(v-bind:content="feedbackItem" v-bind:active="currentFeedbackId === feedbackItem.id" @click="feedbackItem.unread = 0")

    ul(v-if="feedbackItems.length !== 0")
      li.list-header Current conversations
      li.no-content(v-if="feedbackItems.length === 0") You are not in any conversations
      router-link(v-for="(feedbackItem, index) in feedbackItems" v-bind:key="index" @click="currentFeedbackId = feedbackItem.id" v-bind:to="{ name: 'feedback_view', params: { classSlug: classSlug, contentSlug: contentSlug, id: encodedId(feedbackItem.id) }}" tag="li")
        feedback-row(v-bind:content="feedbackItem" v-bind:active="currentFeedbackId === feedbackItem.id" @click="feedbackItem.unread = 0")

    ul(v-if="availableFeedbackItems.length !== 0")
      li.list-header Suggested conversations
      li.no-content(v-if="availableFeedbackItems.length === 0") You have no suggestions
      router-link(v-for="(feedbackItem, index) in availableFeedbackItems" v-bind:key="index" @click="currentFeedbackId = feedbackItem.id" v-bind:to="{ name: 'feedback_view', params: { classSlug: classSlug, contentSlug: contentSlug, id: encodedId(feedbackItem.id) }}" tag="li")
        feedback-row(v-bind:content="feedbackItem" v-bind:active="currentFeedbackId === feedbackItem.id" @click="feedbackItem.unread = 0")

  #conversation-container

    .main-container.main-container-padded.background-white

      .homework-details(v-if="!currentFeedbackId")
        .markdown-wrapper
          markdown-renderer(v-bind:markdown-url="markdownUrl")

        four-corners-link(message="This homework requires the submission of a FourCorners image, we have created a space to learn about FourCorners and what makes it relevant to today's digital photography.")

        h2 Submit Homework
        feedback-submission(v-bind:the-class="classSlug" v-bind:the-content="contentSlug" v-on:reloadchats="reloadChats")

        #login-notice(v-if="!isRegistered" @click="showAuth") Please login to submit homework

      transition(name="fade" type="in out")
        feedback-view(v-bind:currentFeedbackId.sync="currentFeedbackId" v-bind:discussion.sync="discussion" v-bind:class-slug="classSlug" v-bind:content-slug="contentSlug" v-on:reloadchats="reloadChats")

  .clearfix

</template>

<script>
import Vue from 'vue'

import { mapGetters } from 'vuex'

import API from '@/api'
import Auth from '@/mixins/Auth'
import PageStyle from '@/mixins/PageStyle'
import Messages from '@/mixins/Messages'

import _filter from 'lodash/filter'

import PageHeader from '@/components/PageHeader'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import FourCornersLink from '@/components/fourcorners/FourCornersLink'
import FeedbackSubmission from '@/components/feedback/FeedbackSubmission'
import FeedbackTile from '@/components/feedback/FeedbackTile'
import FeedbackRow from '@/components/feedback/FeedbackRow'
import FeedbackView from '@/components/feedback/FeedbackView'
import InfoDialogue from '@/components/InfoDialogue'

import 'vue-awesome/icons/angle-left'
import 'vue-awesome/icons/arrow-right'


export default {
  name: 'feedback',
  mixins: [
    Auth,
    PageStyle,
    Messages,
  ],
  components: {
    PageHeader,
    MarkdownRenderer,
    FeedbackSubmission,
    FourCornersLink,
    InfoDialogue,
    FeedbackTile,
    FeedbackRow,
    FeedbackView,
  },
  activated() {
    // Check if user has registered
    if (this.isAuthenticated && !this.isRegistered) {
      this.$router.push('/registration')
    } else if (this.isAuthenticated) {
      this.$router.push('/')
    } else {
      // Fetch feedback items
      this.getFeedbackItems()
      this.getAvailableFeedbackItems()
    }
  },
  mounted() {
    Vue.$log.info('Feedback view mounted')
    
    this.ensureAuthenticated()

    if (this.$route.params.id) {
      this.currentFeedbackId = this.$route.params.id.replace('%23', '#')
    }

    this.getFeedbackItems()
    this.getAvailableFeedbackItems()
    
    Vue.io.socket.on('user', (obj) => {
      this.$log.info('Submission message received')
      this.$log.info(obj)
      switch (obj.data.msgtype) {
        case 'submission':

          this.getFeedbackItems()
          this.getAvailableFeedbackItems()

          break
        case 'discussion':

          if (this.currentFeedbackId === obj.data.msg.relates_to) {
            this.discussion.push(obj.data.msg)
          }

          break
        default:
      }
    })
  },
  watch: {
    '$route.params.id': {
      handler: function(nV, oV) {
        console.log('$route.params.id')
        if (nV) {
          this.currentFeedbackId = nV.replace('%23', '#')
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      pageStyle: { type: 'homework', minimized: true },
      navTitle: 'Connected Academy - Feedback',
      myFeedbackItems: [],
      feedbackItems: [],
      availableFeedbackItems: [],
      currentFeedbackId: '',
      discussion: [],
    }
  },
  computed: {
    ...mapGetters([
      'isAuthenticated', 'isRegistered', 'user', 'currentClass', 'course',
    ]),
    classSlug() {
      return this.$route.params.classSlug
    },
    contentSlug() {
      return this.$route.params.contentSlug
    },
    markdownUrl() {
      return `${this.course.baseUri}class1/${this.contentSlug}.md`
    },
  },
  methods: {
    encodedId(id) {
      return id.replace('#','%23')
    },
    reloadChats() {
      this.getFeedbackItems()
      this.getAvailableFeedbackItems()
    },
    getFeedbackItems() {
      
      if (!this.classSlug || !this.contentSlug) {
        Vue.$log.info('No class or content slug so returning')
        return
      }

      const request = { class: this.classSlug, content: this.contentSlug }

      Vue.$log.info('No class or content slug so returning')

      API.feedback.getFeedbackItems(
        request,
        (response) => {
          this.$log.info('Response from feedback request')
          this.$log.info(response)
          this.myFeedbackItems = _filter(response.data, (item) => {
            return item.user && (item.user.account_number === this.user.account_number)
          })
          this.feedbackItems = _filter(response.data, (item) => {
            return item.user && (item.user.account_number !== this.user.account_number)
          })
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.info('Failed to retrieve feedback')
        },
      )
    },
    getAvailableFeedbackItems() {
      const request = { class: this.classSlug, content: this.contentSlug }
      API.feedback.getAvailableFeedbackItems(
        request,
        (response) => {
          this.$log.info('Response from feedback request (available)')
          this.$log.info(response)
          this.availableFeedbackItems = response.data
        },
        (response) => {
          // TODO: Handle failed request
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

$chat-list-width = 320px

.feedback-page
  pinned()
  background-color $color-lightest-grey
  top $navigation-height
  overflow-x none
  overflow-y scroll
  position fixed
  
  .feedback-page--header
    pinned()
    border-top alpha(white, .1) 1px solid
    background-color $color-homework
    height $page-header-height
    padding 20px
    position fixed
    top $navigation-height
    bottom auto
    z-index 2

    h3
      reset()
      color white
      line-height $page-header-height
      padding 0 10px
      whitespace nowrap

#chat-list-container
  box-sizing()
  pinned()
  background-color white
  border-right $color-lighter-grey 1px solid
  overflow-y scroll
  position fixed
  right auto
  top $navigation-height + $page-header-height
  width $chat-list-width
  @media(max-width: 600px)
    width 75px
  ul
    cleanlist()
    border-bottom $color-lighter-grey 1px solid
    @media(max-width: 600px)
      margin-top 10px
    li
      cleanlist()
      border-top $color-lighter-grey 1px solid
      &.list-header
        border-top none
        color $color-text-grey
        font-size 0.9em
        padding 20px 10px 5px 10px
        @media(max-width: 600px)
          display none
      &.no-content
        border-top none
        color $color-text-light-grey
        line-height 20px
        padding 10px 10px 20px 10px
        text-align left

#conversation-container
  background-color white
  border-right $color-lighter-grey 1px solid
  min-height 100%
  padding-left $chat-list-width
  padding-top $page-header-height
  @media(max-width: 600px)
    padding-left 75px
  .main-container
    max-width 800px
    h2
      color $color-text-dark-grey
      font-size 1.3em

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
