<template lang="pug">

  .submission-grid-wrapper(v-if="content.expectsubmission")

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

@import "../assets/stylus/shared/*"

ul.submission-grid
  cleanlist()
  background-color $color-grey
  border $color-grey 1px solid
  margin-top 15px
  li.submission-grid--tile
    cleanlist()
    float left
    margin-right 15px
    img
      radius(6px)
      background-color $color-light-grey
      display block
      height 80px

</style>
