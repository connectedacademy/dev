<template lang="pug">

  .single-message-wrapper(:class="{ opened: segmentOpened }")

    .message
      img.profile-image(v-if="message._user" :src="message._user.profile.avatar")

      .author-label(v-if="message._user")
        | {{ message._user.profile.name }}
        i.fas.fa-reply(v-if="message._parent")

      p.message-content(v-html="parseText()")

      .message--footer

        ul.tweet-actions(v-if="moderate")
          li Allow
          li Deny

        ul.tweet-actions
          li.like-action(:class="{ active: (message._likes.indexOf(user._id) !== -1) }" @click="likeMessage")
            i.fas.fa-heart
          li.reply-action(@click="replyToMessage(message)" v-if="!message._parent")
            i.fas.fa-reply
          router-link(v-if="$route.name !== 'live'" tag="li" :to="{ name: 'live', params: { classSlug: message.class, contentSlug: 'liveclass', segmentId: message.segment } }")
            i.fas.fa-plus
          li.moderate-action(@click="reportItem(message._id)")
            i.fas.fa-ellipsis-h
          li.message-timestamp
            | {{ timeStamp }}

          .clearfix
    
    .replies-wrapper
      .reply-wrapper(v-for="(reply, index) in message._replies" :key="index")
        message(:user="user" :message="reply")

</template>

<script>
import API from '@/api'
import TweetPatch from 'tweet-patch'
import Moment from 'moment-mini'
import _find from 'lodash/find'

import Report from '@/mixins/Report'

export default {
  name: 'message',
  props: ['message', 'truncate', 'canJump', 'segmentOpened', 'moderate', 'user'],
  mixins: [Report],
  computed: {
    authorLink() { return `https://twitter.com/${this.message._user.account}` },
    tweetLink() { return `https://twitter.com/statuses/${this.message.message_id}` },
    replyLink() { return `https://twitter.com/intent/tweet?replyTo=${this.message.message_id}` },
    retweetLink() { return `https://twitter.com/intent/retweet?tweet_id=${this.message.message_id}` },
    likeLink() { return `https://twitter.com/intent/like?tweet_id=${this.message.message_id}` },
    timeStamp() { return Moment(this.message.created).fromNow() },
  },
  methods: {
    parseText() {
      // Remove links
      let html = this.message.text.replace(/(https?:\/\/[^\s]+)/g, '')
      // Add linked hashtags
      html = TweetPatch(html, { hrefProps: { class: 'tweet-link', target: '_blank' } })
      // Open hashtag links in new tab
      html = html.replace(/(">)/g, '" target="_blank">')
      // Return formatted message text
      return html;
    },
    showInfoModal() {
      this.$store.commit('SHOW_INFO_MODAL', { title: this.$t('demo.unavailable_title'), body: this.$t('demo.unavailable_description'), action: this.$t('common.okay') })
    },
    replyToMessage(message) {
      this.$store.commit('SET_REPLYING_TO', message)
    },
    likeMessage() {
      const postData = {
        target: this.message._id
      }
      API.message.likeMessage(
        postData,
        (response) => {
          this.message._likes.push(this.user._id)
        },
        (response) => {
        }
      )
    }
  },
}
</script>

<style lang="stylus">

@import '~stylus/shared'

.single-message-wrapper
  position relative

  .message
    box-sizing()
    max-height 128px
    margin 10px 15px
    padding 0 10px 40px 10px
    padding-left 50px
    position relative

    img.profile-image
      radius(50%)
      height 40px
      width 40px
      position absolute
      top 0px
      left 0px

    p.message-content
      reset()
      color $color-text-dark-grey
      max-height 70px
      display -webkit-box
      overflow hidden
      pointer-events none
      text-overflow ellipsis
      word-wrap break-word
      -webkit-line-clamp 3
      -webkit-box-orient vertical
      a, a:active
        color $color-text-light-grey
        text-decoration none

    .author-label
      color $color-text-dark-grey
      font-weight bold
      text-decoration none
      font-size 0.9em
      svg
        color $color-info
        height 12px
        margin 0 10px

    .message--footer
      pinned()
      height 36px
      left 42px
      top auto
      overflow hidden
      position absolute

      ul.tweet-actions
        cleanlist()
        background-color inherit
        li
          cleanlist()
          box-sizing()
          animate()
          color #CCC
          float left
          font-size 1em
          line-height 36px
          margin 0 10px
          max-width 15%
          text-decoration none
          &:hover
            cursor pointer
            color $color-primary
          &.like-action:hover, &.like-action.active
            color red
          &.retweet-action:hover, &.retweet-action.active
            color $color-twitter
          &.reply-action:hover, &.reply-action.active
            color $color-primary

          &.message-timestamp
            color #CCC
            font-size 0.9em
            float right
            max-width 55%

  &.opened
    .message
      p.message-content
        pointer-events all

  .replies-wrapper
    margin-left 20px

</style>
