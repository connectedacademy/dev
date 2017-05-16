<template lang="pug">

  .col#col-main.background-white(v-bind:class="this.$store.state.layout.columns.main.state")

    previous-button

    .container

      markdown-renderer(v-bind:front-matter-visible="frontMatterVisible")

</template>

<script>
import MarkdownRenderer from '@/components/MarkdownRenderer';
import PreviousButton from '@/components/PreviousButton';

export default {
  name: 'markdown',
  created() {
    this.$store.dispatch('setColumnState', 'narrow');
  },
  methods: {
    toggleColumnState() {
      this.$store.dispatch('toggleColumnState');
    },
    back() { this.$router.go(-1); },
  },
  components: {
    MarkdownRenderer,
    PreviousButton,
  },
  data() {
    return {
      frontMatterVisible: false,
    };
  },
};
</script>

<style lang="stylus" scoped>

@import '../assets/stylus/shared/*'
@import '../assets/stylus/layout/page'

</style>
