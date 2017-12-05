<template lang="pug">

  .single-message-wrapper(v-bind:class="{ opened: segmentOpened }")

    .message
      img.profile-image(v-if="message.author" v-bind:src="message.author.profile")

      .author-label(v-if="message.author")
        | {{ message.author.account }}
        icon(v-if="message.replyto" name="reply")

      p.message-content(v-html="parseText()")

      .message--footer

        ul.tweet-actions(v-if="canJump")
          router-link.jump-action(tag="li" v-bind:to="{ name: 'class', params: { classSlug: message.class, contentSlug: 'liveclass', segmentId: message.segment } }")
            //- icon(name="link")
            | View in context
        ul.tweet-actions(v-else)
          li.like-action(@click="showInfoModal()")
            //-  v-bind:href="likeLink" target="_blank"
            icon(name="heart")
          li.retweet-action(@click="showInfoModal()")
            //-  v-bind:href="retweetLink" target="_blank"
            icon(name="retweet")
          li.reply-action(@click="replyToMessage(message)")
            //-  v-bind:href="replyLink" target="_blank"
            icon(name="reply")
          li.message-timestamp
            | {{ timeStamp }}

          .clearfix
    
    .replies-wrapper
      .reply-wrapper(v-for="(reply, index) in message.in_reply" v-bind:key="index")
        message(v-bind:message="reply")

</template>

<script>
import TweetPatch from 'tweet-patch'
import Moment from 'moment-mini'

import 'vue-awesome/icons/heart'
import 'vue-awesome/icons/retweet'
import 'vue-awesome/icons/reply'
import 'vue-awesome/icons/star'
import 'vue-awesome/icons/link'

export default {
  name: 'message',
  props: ['message', 'truncate', 'canJump', 'segmentOpened'],
  computed: {
    authorLink() { return `https://twitter.com/${this.message.author.account}` },
    tweetLink() { return `https://twitter.com/statuses/${this.message.message_id}` },
    replyLink() { return `https://twitter.com/intent/tweet?in_reply_to=${this.message.message_id}` },
    retweetLink() { return `https://twitter.com/intent/retweet?tweet_id=${this.message.message_id}` },
    likeLink() { return `https://twitter.com/intent/like?tweet_id=${this.message.message_id}` },
    timeStamp() { return Moment(this.message.createdAt).fromNow() },
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
        color $color-text-dark-grey

    .author-label
      color $color-text-dark-grey
      font-weight bold
      text-decoration none
      font-size 0.9em
      .fa-icon
        color $color-primary
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
          &.jump-action
            max-width 100%
            line-height 30px

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
