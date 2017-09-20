<template lang="pug">

.markdown-page

  .col#col-main(v-bind:class="this.$store.state.layout.columns.main.state")

    previous-button

    .main-container.background-white

      .container

        markdown-renderer(v-bind:front-matter-visible="frontMatterVisible")

</template>

<script>
import * as types from '@/store/mutation-types';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import PreviousButton from '@/components/PreviousButton';

export default {
  name: 'markdown',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(types.SET_NAV_STATE, { minimized: false });
      vm.$store.commit(types.SET_PAGE_STYLE, undefined);
    });
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
  methods: {
    back() { this.$router.go(-1); },
  },
};
</script>