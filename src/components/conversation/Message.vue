<template lang="pug">

  .message.animated.fadeIn

    p.hidden {{ message.segment }}

    img.profile-image(v-bind:src="message.author.profile")

    p.author-label
      strong {{ message.author.account }}

    p.message-content
      | {{ ' ' + message.text }}

    ul.tweet-actions
      li
        a(v-bind:href="replyLink" target="_blank")
          icon(name="reply")
      li
        a(v-bind:href="retweetLink" target="_blank")
          icon(name="retweet")
      li
        a(v-bind:href="likeLink" target="_blank")
          icon(name="heart")

</template>

<script>
import _ from 'lodash';

export default {
  name: 'message',
  props: ['message'],
  computed: {
    replyLink() {
      return `https://twitter.com/intent/tweet?in_reply_to=${this.message.message_id}`;
    },
    retweetLink() {
      return `https://twitter.com/intent/retweet?tweet_id=${this.message.message_id}`;
    },
    likeLink() {
      return `https://twitter.com/intent/like?tweet_id=${this.message.message_id}`;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '../../assets/stylus/shared/*'

.message
  margin 15px
  padding 5px 10px
  padding-left 50px

  position relative

  transition opacity 1s

  img.profile-image
    radius(50%)
    height 40px
    width 40px
    position absolute
    top 5px
    left 0

  p.author-label, p.message-content
    nomargin()
    nopadding()
    color $color-text-dark-grey

  ul.tweet-actions
    cleanlist()
    li
      cleanlist()
      display inline-block
      font-s ize 0.9em
      margin 5px 10px
      a
        color #CCC
        text-decoration none
        &:hover
          color $color-primary

</style>
