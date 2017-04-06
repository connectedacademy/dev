<template lang="pug">

  .col#col-main(ref="main" v-bind:class="this.$store.state.layout.columns.main.state" @scroll="onScroll")

    .stream

      pre-content

      class-content

      post-class-content

      webinar-content

      post-webinar-content

    message-composer

</template>

<script>
import PreContent from './content/PreContent';
import ClassContent from './content/ClassContent';
import PostClassContent from './content/PostClassContent';
import WebinarContent from './content/WebinarContent';
import PostWebinarContent from './content/PostWebinarContent';

import MessageComposer from './MessageComposer';

export default {
  name: 'main',
  created() {
    this.$store.dispatch('setColumnState', 'narrow');
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
    };
  },
  components: {
    PreContent,
    ClassContent,
    PostClassContent,
    WebinarContent,
    PostWebinarContent,
    MessageComposer,
  },
  methods: {
    onScroll() {
      let scrollPosition = this.$refs.main.scrollTop / 100;
      scrollPosition = (scrollPosition < 0) ? 0 : scrollPosition;
      this.$store.dispatch('setScrollPosition', scrollPosition);
    },
  },
};
</script>

<style lang="stylus">

@import "../assets/stylus/layout/page"

  .stream
    padding-bottom 80px

</style>
