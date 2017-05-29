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
          a(v-bind:href="replyLink" target="_blank")
            icon(name="reply")
        li
          a(v-bind:href="retweetLink" target="_blank")
            icon(name="retweet")
        li.message-timestamp
          a(v-bind:href="tweetLink" target="_blank")
            | {{ timeStamp }}

        .clearfix

</template>

<script>
import _ from 'lodash';
import TweetPatch from 'tweet-patch';
import Moment from 'moment';

export default {
  name: 'message',
  props: ['message'],
  computed: {
    html() {
      return TweetPatch(`#TestHashtag @edjenkins91 ${this.message.text}`, { hrefProps: { class: 'tweet-link', target: '_blank' } });
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
      return Moment().format('LTS - dd mm YYYY');
    },
  },
};
</script>

<style lang="stylus">

@import '../../assets/stylus/shared/*'

.message
  max-height 98px
  margin 0 15px 0 15px
  padding 0 10px 50px 10px
  padding-left 50px

  position relative

  img.profile-image
    radius(50%)
    height 40px
    width 40px
    position absolute
    top 5px
    left 0

  p.message-content
    nomargin()
    nopadding()
    color $color-text-dark-grey
    a, a:active
      color $color-text-dark-grey

  a.author-label
    color $color-purple
    font-weight bold
    text-decoration none
    font-size 0.9em

  .message--footer
    pinned()
    background-color white
    height 36px
    left 40px
    top auto
    overflow hidden
    position absolute

    ul.tweet-actions
      cleanlist()
      li
        cleanlist()
        box-sizing border-box
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
          max-width 55%
          a
            font-size 0.8 !important


</style>
