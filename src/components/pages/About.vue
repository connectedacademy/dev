<template lang="pug">

  .col#col-main.background-white(v-bind:class="this.$store.state.layout.columns.main.state")

    .container

      markdown-renderer(v-bind:markdown-url="markdownUrl")

</template>

<script>

import MarkdownRenderer from '@/components/MarkdownRenderer';

export default {
  name: 'about',
  created() {
    this.$store.dispatch('setColumnState', 'narrow');
  },
  data() {
    return {
      navTitle: 'About - Connected Academy',
      markdownUrl: 'https://testclass.connectedacademy.io/course/content/en/about.md',
    };
  },
  components: {
    MarkdownRenderer,
  },
};

</script>

<style lang="stylus" scoped>
</style>
