<template lang="pug">

.feedback-page(name="feedback-page")
  
  page-header(title="Response Area" identifier="homework")

  #chat-list-container
    feedback-list(header="Your Responses" v-bind:classSlug="classSlug" v-bind:contentSlug="contentSlug" v-bind:feedbackItems="myFeedbackItems" noContent="You are not in any conversations" v-bind:currentFeedbackId="currentFeedbackId")
    feedback-list(header="Current conversations" v-bind:classSlug="classSlug" v-bind:contentSlug="contentSlug" v-bind:feedbackItems="feedbackItems" noContent="You are not in any conversations" v-bind:currentFeedbackId="currentFeedbackId")    
    feedback-list(header="Suggested conversations" v-bind:classSlug="classSlug" v-bind:contentSlug="contentSlug" v-bind:feedbackItems="availableFeedbackItems" noContent="No suggestions available" v-bind:currentFeedbackId="currentFeedbackId")
    
  #conversation-container.background-white

    .homework-details(v-if="!currentFeedbackId")
      .markdown-wrapper
        markdown-renderer(v-bind:markdown-url="markdownUrl")

      four-corners-link(message="This task requires the submission of a FourCorners image, we have created a space to learn about FourCorners and what makes it relevant to today's digital photography.")

      h2 Submit Response
      feedback-submission(v-bind:the-class="classSlug" v-bind:the-content="contentSlug" v-on:reloadchats="reloadChats")

      #login-notice(v-if="!isRegistered" @click="showAuth") Please login to submit a response

    transition(name="fade" type="in out")
      feedback-view(v-bind:currentFeedbackId.sync="currentFeedbackId" v-bind:discussion.sync="discussion" v-bind:class-slug="classSlug" v-bind:content-slug="contentSlug" v-on:reloadchats="reloadChats")

  .clearfix

</template>

<script>
import Vue from 'vue'

import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

import API from '@/api'
import Auth from '@/mixins/Auth'
import PageStyle from '@/mixins/PageStyle'

import _get from 'lodash/get'
import _filter from 'lodash/filter'

import PageHeader from '@/components/PageHeader'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import FourCornersLink from '@/components/fourcorners/FourCornersLink'
import FeedbackSubmission from '@/components/feedback/FeedbackSubmission'
import FeedbackList from '@/components/feedback/FeedbackList'
import FeedbackView from '@/components/feedback/FeedbackView'
import InfoDialogue from '@/components/InfoDialogue'

export default {
  name: 'feedback',
  mixins: [
    Auth,
    PageStyle
  ],
  components: {
    PageHeader,
    MarkdownRenderer,
    FeedbackSubmission,
    FourCornersLink,
    InfoDialogue,
    FeedbackList,
    FeedbackView,
  },
  activated() {
    // Fetch feedback items
    this.getFeedbackItems()
    this.getAvailableFeedbackItems()
  },
  mounted() {
    this.subscribeToSocketEvents()

    if (this.$route.params.id) {
      this.currentFeedbackId = this.$route.params.id.replace('%23', '#')
    }

    this.getFeedbackItems()
    this.getAvailableFeedbackItems()
  },
  watch: {
    '$route.params.id': {
      handler: function(nV, oV) {
        if (nV) {
          this.currentFeedbackId = nV.replace('%23', '#')
        } else {
          this.currentFeedbackId = undefined
        }
      },
      deep: true
    }
  },
  data() {
    return {
      pageStyle: { type: 'homework', visible: true, minimized: true },
      navTitle: 'Connected Academy - Feedback',
      currentFeedbackId: '',
      myFeedbackItems: [],
      feedbackItems: [],
      availableFeedbackItems: [],
      discussion: []
    }
  },
  computed: {
    ...mapGetters([
      'isRegistered', 'user', 'currentClass', 'course'
    ]),
    classSlug() {
      return this.$route.params.classSlug
    },
    contentSlug() {
      return this.$route.params.contentSlug
    },
    markdownUrl() {
      return `${this.course.baseUri}${this.currentClass.dir}/${this.contentSlug}.md`
    },
  },
  methods: {
    subscribeToSocketEvents() {
      // Get user socket (for submissions and feedback messages)
      this.$io.socket.get(`/v1/auth/me`, function (resData, jwres) {
        Vue.$log.debug('SOCKET RESPONSE - me')
        // alert('SOCKET RESPONSE - me')
        Vue.$log.debug(resData)
      })
    
      EventBus.$on('socketUser', (obj) => {
        this.$log.debug('socketUser')

        this.$log.debug('Submission message received')
        this.$log.debug(obj)

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
    reloadChats() {
      this.getFeedbackItems()
      this.getAvailableFeedbackItems()
    },
    getFeedbackItems() {
      
      if (!this.classSlug || !this.contentSlug) {
        Vue.$log.debug('No class or content slug so returning')
        return
      }

      const request = { class: this.classSlug, content: this.contentSlug }

      Vue.$log.debug('No class or content slug so returning')

      API.feedback.getFeedbackItems(
        request,
        (response) => {
          this.$log.debug('Response from feedback request')
          this.$log.debug(response)
          this.myFeedbackItems = _filter(response.data, (item) => {
            return item.user && (item.user.account_number === this.user.account_number)
          })
          this.feedbackItems = _filter(response.data, (item) => {
            return item.user && (item.user.account_number !== this.user.account_number)
          })
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.error(response)
          this.$log.info('Failed to retrieve feedback')
        },
      )
    },
    getAvailableFeedbackItems() {
      const request = { class: this.classSlug, content: this.contentSlug }
      API.feedback.getAvailableFeedbackItems(
        request,
        (response) => {
          this.$log.debug('Response from feedback request (available)')
          this.$log.debug(response)
          this.availableFeedbackItems = _filter(response.data, (o) => {
            return _get(o, 'user.profile', false)
          })
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
  overflow-y auto
  position fixed
  right auto
  top $navigation-height + $page-header-height
  width $chat-list-width
  z-index 1
  @media(max-width: 600px)
    width 75px

#conversation-container
  background-color white
  border-right $color-lighter-grey 1px solid
  min-height 100%
  padding 20px
  padding-left $chat-list-width + 20px
  padding-top $page-header-height + 20px
  position relative
  max-width 800px
  z-index 0
  @media(max-width: 600px)
    padding-left 75px + 20px
  h2
    color $color-text-dark-grey
    font-size 1.3em

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
