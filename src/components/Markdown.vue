<template lang="pug">

.markdown-page

  .col#col-main(v-bind:class="this.$store.state.layout.columns.main.state")

    .main-container.background-white
      previous-button

      .container

        markdown-renderer(v-bind:front-matter-visible="frontMatterVisible")

</template>

<script>

import AnimatedLogo from '@/components/AnimatedLogo';

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
    AnimatedLogo,
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

@import '~stylus/shared'

</style>
