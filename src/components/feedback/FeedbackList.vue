<template lang="pug">
  ul(v-if="feedbackItems.length !== 0")
    li.list-header {{ header }}
    li.no-content(v-if="feedbackItems.length === 0") You are not in any conversations
    router-link(v-for="(feedbackItem, index) in feedbackItems" v-bind:key="index" v-bind:to="{ name: 'feedback_view', params: { classSlug: classSlug, contentSlug: contentSlug, id: encodedId(feedbackItem.id) }}" tag="li")
      feedback-row(v-bind:content="feedbackItem" v-bind:active="currentFeedbackId === feedbackItem.id" @click="feedbackItem.unread = 0")
</template>

<script>
import FeedbackRow from '@/components/feedback/FeedbackRow'

export default {
  name: 'feedback-list',
  props: [
    'classSlug',
    'contentSlug',
    'feedbackItems',
    'header',
    'noContent',
    'currentFeedbackId'
  ],
  components: {
    FeedbackRow
  },
  methods: {
    encodedId(id) {
      return id.replace('#','%23')
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

ul
  cleanlist()
  border-bottom $color-lighter-grey 1px solid
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

</style>
