<template lang="pug">

  .submission-grid-wrapper(v-if="content.submissions.length > 0")
    pre.hidden {{ content}}
    ul.submission-grid
      li.submission-grid--tile(v-for="submission in content.submissions" @click="viewSubmissions")
        img(v-bind:src="submission.thumbnail")
      li.submission-grid--tile.placeholder
      li.submission-grid--tile.placeholder
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

@import "../assets/stylus/shared"

.submission-grid-wrapper
  background-color white
  p.content-description
    color $color-text-dark-grey
  ul.submission-grid
    cleanlist()
    padding 10px
    li.submission-grid--tile
      cleanlist()
      float left
      margin 10px
      &:hover
        cursor pointer
      img
        background-color white
        display block
        height 120px
        max-width 300px

</style>
