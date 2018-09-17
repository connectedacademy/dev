<template lang="pug">

.feedback-submission-wrapper(v-if="isRegistered")

  .feedback-submission.feedback-submission-submit
    label
      | Paste the link to your image below
    input(type="text" name="link" placeholder="e.g. https://example.com/my-image.jpg" v-model="submissionLink")
    textarea(name="description" placeholder="Add a description to your submission..." v-model="submissionDescription")
    .pure-button.pure-button-transparent.pull-right(v-on:click="postSubmission") Submit
    .clearfix
  
  .submission-selector(v-if="submissionLink")
    .submission-image(v-bind:style="{ 'background-image': `url(${submissionLink})` }")
    .clearfix

</template>

<script>
import { mapGetters } from 'vuex'
import API from '@/api'
import * as types from '@/store/mutation-types'

export default {
  name: 'feedback-submission',
  props: ['theClass', 'theContent'],
  data() {
    return {
      submissionLink: '',
      submissionDescription: ''
    }
  },
  computed: {
    ...mapGetters([
      'isRegistered',
    ])
  },
  methods: {
    postSubmission() {
      const postData = {
        class: this.theClass,
        content: this.theContent,
        url: this.submissionLink,
        description: this.submissionDescription
      }

      API.homework.postHomework(
        postData,
        (response) => {
          this.submissionLink = ''
          this.submissionDescription = ''
          alert('Posted')
        },
        (response) => {
          this.submissionLink = ''
          this.submissionDescription = ''
          this.$log.error(response)
          this.$log.info('Submission failed')
          alert('Submission failed, please try again.')
        }
      )
    }
  }
}
</script>

<style lang="stylus">

@import '~stylus/shared'
@import '~stylus/buttons'

.feedback-submission-wrapper
  radius(6px)
  box-sizing()
  background-color $color-homework
  overflow hidden
  width 100%
  .feedback-submission
    padding 15px
    &.feedback-submission-submit
      label
        color white
        svg
          margin 0 5px
      p
        reset()
        color white
        line-height 40px
        margin-top 10px
      input[type="text"], textarea
        radius(6px)
        box-sizing()
        border none
        box-shadow none
        display block
        line-height 40px
        margin 10px 0 20px 0
        padding 0 10px
        outline 0
        resize none
        min-width 260px
      textarea
        width 100%

  .submission-selector
    cleanlist()
    background-color alpha(black, 0.2)
    margin-top 5px
    padding 10px
    .submission-image
      cleanlist()
      background-image()
      float left
      height 140px
      margin 10px
      outline white 3px solid
      width 200px


</style>
