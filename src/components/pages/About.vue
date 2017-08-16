<template lang="pug">

    .about-page

      .col#col-main

        .main-container.main-container-padded.background-white

          markdown-renderer(v-bind:markdown-url="markdownUrl")

</template>

<script>
import { mapGetters } from 'vuex'
import MarkdownRenderer from '@/components/MarkdownRenderer';

export default {
  name: 'about',
  components: {
    MarkdownRenderer,
  },
  created() {
    this.$store.dispatch('setColumnState', 'narrow');
  },
  data() {
    return {
      navTitle: 'About - Connected Academy',
    };
  },
  computed: {
    ...mapGetters(['course']),
    markdownUrl() {
      return `${this.course.baseUri}about.md`
    }
  }
};

</script>

<style lang="stylus" scoped>
</style>
