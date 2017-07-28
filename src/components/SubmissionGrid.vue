<template lang="pug">

  .submission-grid-wrapper(v-if="content.submissions.length > 0")
    p.content-description You have made {{ content.submissions.length }} submission(s)

    ul.hidden.submission-grid
      li.submission-grid--tile(v-for="submission in content.submissions" @click="viewSubmissions")
        img(v-bind:src="submission.thumbnail")
      .clearfix

</template>

<script>
export default {
  name: 'submission-grid',
  props: ['content'],
  methods: {
    viewSubmissions() {
      this.$router.push(`/feedback/browse/${this.$store.getters.currentClass.slug}/${this.content.slug}`);
    },
  },
};
</script>

<style lang="stylus" scoped>

@import "~stylus/shared"

.submission-grid-wrapper
  background-color $color-homework
  border-top alpha(white, 0.2) 1px solid
  margin 0 10px
  overflow hidden
  p.content-description
    color alpha(white, 0.5)
    text-align center
  ul.submission-grid
    cleanlist()
    height 100px
    overflow-x auto
    overflow-y hidden
    padding 10px 0
    text-align center
    li.submission-grid--tile
      cleanlist()
      display inline-block
      margin 10px
      &:hover
        cursor pointer
      img
        background-color white
        /*border white 1px solid*/
        display block
        height 80px
        max-width 300px

</style>
