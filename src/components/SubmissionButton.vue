<template lang="pug">

  .submission-button
    .pure-button.pure-button-primary.pull-left(v-if="content.expectsubmission && content.submissions.length" @click="viewSubmissions")
      | {{ $t('submission.view_submissions') }}
    .pure-button.pure-button-primary.pull-left(v-if="content.expectsubmission && !content.submissions.length" @click="makeSubmission")
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
      this.$router.push(this.content.url);
    },
  },
};
</script>

<style lang="stylus" scoped>

@import "../assets/stylus/shared/*"

</style>
