<template lang="pug">

  .submission-button-wrapper
    .pure-button(v-if="content.expectsubmission && content.submissions.length" @click="viewSubmissions")
      | {{ $t('submission.view_submissions') }}
    .pure-button(v-if="content.expectsubmission && content.url && !content.submissions.length" @click="makeSubmission")
      | {{ $t('submission.make_a_submission') }}

</template>

<script>
export default {
  name: 'submission-button',
  props: ['content'],
  methods: {
    viewSubmissions() {
      this.$router.push(`/feedback/browse/${this.$store.getters.currentClass.slug}/${this.content.slug}`);
    },
    makeSubmission() {
      const encodedURI = encodeURIComponent(`${this.$store.getters.currentClass.dir}/${this.content.url}`);
      this.$router.push(`/markdown/${encodedURI}`);
    },
  },
};
</script>

<style lang="stylus" scoped>

@import "../assets/stylus/shared"

.submission-button-wrapper
  text-align center
  .pure-button
    background-color transparent
    border white 1px solid
    color white
    margin 10px auto 5px auto
    &:hover
      background-color white
      color $color-homework

</style>
