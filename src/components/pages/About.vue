<template lang="pug">

    .about-page

      .col#col-main

        .main-container.main-container-padded.background-white

          markdown-renderer(v-bind:markdown-url="markdownUrl")

</template>

<script>
import * as types from '@/store/mutation-types';
import { mapGetters } from 'vuex'
import MarkdownRenderer from '@/components/MarkdownRenderer';

export default {
  name: 'about',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(types.SET_NAV_STATE, { minimized: false });
      vm.$store.commit(types.SET_PAGE_STYLE, undefined);
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit(types.SET_NAV_STATE, { minimized: true });
    this.$store.commit(types.SET_PAGE_STYLE, undefined);
    next();
  },
  components: {
    MarkdownRenderer,
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
