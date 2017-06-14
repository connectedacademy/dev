<template lang="pug">

.feedback-tile(@click="viewFeedback")

  .message-count.animated.fadeInUp(v-if="content.messages") {{ content.messages }}
  .unread-count.animated.tada(v-if="content.unread") {{ content.unread }} New

  .thumbnail-image(v-bind:style="{ 'background-image': 'url(' + content.thumbnail + ')' }")

  .user-strip
    img.user-profile-image(v-bind:src="content.user.profile")
    h5.user-profile-name {{ content.user.name }}


</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'feedback-tile',
  props: ['content'],
  methods: {
    viewFeedback() {
      this.$router.push(this.url);
    },
  },
  computed: {
    url() {
      return `/feedback/${this.content.id.replace('#', '%23')}`;
    }
  }
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.feedback-tile
  cleanlist()
  background-color $color-light-grey
  margin 10px
  position relative

  .message-count, .unread-count
    radius(12px)
    color white
    display inline-block
    font-size 0.8em
    height 24px
    line-height 24px
    min-width 8px
    padding 0 8px
    position absolute
    top 5px

  .message-count
    background-color $color-primary
    right 5px

  .unread-count
    background-color $color-success
    left 5px

  .thumbnail-image
    background-color darken($color-light-grey, 10%)
    background-size cover
    background-repeat no-repeat
    background-position center
    display block
    padding-bottom 56%
    height 0
    width 100%

  .user-strip
    background-color white
    padding-left 50px
    position relative

    img.user-profile-image
      radius(50%)
      border white 3px solid
      height 40px
      width 40px
      position absolute
      top -10px
      left 5px

    h5.user-profile-name
      reset()
      height 32px
      line-height 32px
      padding 0 10px
      animate()

  &:hover
    cursor pointer
    .user-strip
      h5.user-profile-name
        color $color-primary
</style>
