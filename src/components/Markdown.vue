<template lang="pug">

  .col#col-main.background-white(v-bind:class="this.$store.state.layout.columns.main.state")

    .container

      .markdown-nav
        .pure-button.pure-button-primary(@click="back") Back
        .pure-button.pure-button-primary(@click="toggleColumnState") Toggle

        .pure-button.pure-button-primary.pull-right(@click="frontMatterVisible =!frontMatterVisible") FM

      markdown-renderer(v-bind:front-matter-visible="frontMatterVisible")

</template>

<script>
// import _ from 'lodash';
import MarkdownRenderer from '@/components/MarkdownRenderer';

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

.markdown-nav
  border-bottom $color-light-grey 1px solid
  margin 0 -5px 20px -5px
  padding-bottom 20px
  .pure-button
    margin 0 5px
  a
    color white

</style>
