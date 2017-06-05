<template lang="pug">

  .submission-grid-wrapper(v-if="content.expectsubmission && (content.submissions.length > 0)")
    p.content-description
      | Below are your submission(s):
    ul.submission-grid
      li.submission-grid--tile(v-for="submission in content.submissions")
        img( v-bind:src="submission.thumbnail")
      .clearfix

</template>

<script>
export default {
  name: 'submission-grid',
  props: ['content'],
  methods: {
    viewSubmissions() {
      this.$router.push('/feedback/browse/evidence/intro')
    },
  },
};
</script>

<style lang="stylus" scoped>

@import "../assets/stylus/shared"

.submission-grid-wrapper
  p.content-description
    color $color-text-dark-grey
  ul.submission-grid
    cleanlist()
    background-color $color-light-grey
    border $color-grey 1px solid
    margin-top 15px
    padding 5px
    li.submission-grid--tile
      cleanlist()
      float left
      padding 5px
      img
        radius(6px)
        background-color white
        display block
        height 80px

</style>
