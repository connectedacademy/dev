<template lang="pug">

  .message

    img.profile-image(v-bind:src="message.author.profile")

    a.author-label(v-bind:href="authorLink" target="_blank") {{ message.author.account }}

    p.message-content(v-html="html")

    .message--footer

      ul.tweet-actions
        li
          a(v-bind:href="likeLink" target="_blank")
            icon(name="heart")
        li
          a(v-bind:href="retweetLink" target="_blank")
            icon(name="retweet")
        li
          a(v-bind:href="replyLink" target="_blank")
            icon(name="reply")
        li.hidden
          a(v-bind:href="tweetLink" target="_blank")
            icon(name="twitter")
        li.message-timestamp
          | {{ timeStamp }}

        .clearfix

</template>

<script>
import _ from 'lodash/core';
import TweetPatch from 'tweet-patch';
import Moment from 'moment-mini';

import 'vue-awesome/icons/heart';
import 'vue-awesome/icons/retweet';
import 'vue-awesome/icons/reply';
import 'vue-awesome/icons/twitter';

export default {
  name: 'message',
  props: ['message'],
  computed: {
    html() {
      // Remove links
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      let html = this.message.text.replace(urlRegex, '');
      return TweetPatch(html, { hrefProps: { class: 'tweet-link', target: '_blank' } });
    },
    authorLink() {
      return `https://twitter.com/${this.message.author.account}`;
    },
    tweetLink() {
      return `https://twitter.com/statuses/${this.message.message_id}`;
    },
    replyLink() {
      return `https://twitter.com/intent/tweet?in_reply_to=${this.message.message_id}`;
    },
    retweetLink() {
      return `https://twitter.com/intent/retweet?tweet_id=${this.message.message_id}`;
    },
    likeLink() {
      return `https://twitter.com/intent/like?tweet_id=${this.message.message_id}`;
    },
    timeStamp() {
      return Moment(this.message.createdAt).fromNow();
      // return Moment(this.message.createdAt).format('LTS - ddd M YYYY');
    },
  },
};
</script>

<style lang="stylus">

@import '~stylus/shared'

.message
  box-sizing()
  max-height 128px
  margin 10px
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
    word-break break-all
    a, a:active
      color $color-text-dark-grey

  a.author-label
    color $color-purple
    font-weight bold
    text-decoration none
    font-size 0.9em

  .message--footer
    pinned()
    height 36px
    left 42px
    top auto
    overflow hidden
    position absolute

    ul.tweet-actions
      cleanlist()
      background-color white
      li
        cleanlist()
        box-sizing()
        float left
        font-size 1em
        line-height 36px
        margin 0 10px
        max-width 15%
        a
          color #CCC
          text-decoration none
          &:hover
            color $color-primary

        &.message-timestamp
          color #CCC
          font-size 0.9em
          float right
          max-width 55%

</style>
