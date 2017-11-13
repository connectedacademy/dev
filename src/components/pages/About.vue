<template lang="pug">

    .about-page(name="about-page")

      .col#col-main

        .main-container.main-container-padded.background-white

          markdown-renderer(v-bind:markdown-url="markdownUrl")

</template>

<script>
import * as types from '@/store/mutation-types';
import { mapGetters } from 'vuex'

// Mixins
import MarkdownRenderer from '@/components/MarkdownRenderer';

// Components
import PageStyle from '@/mixins/PageStyle';

export default {
  name: 'about',
  mixins: [ PageStyle ],
  components: {
    MarkdownRenderer,
  },
  data() {
    return {
      navTitle: 'About - Connected Academy',
      pageStyle: { type: undefined, minimized: false }
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
