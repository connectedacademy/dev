<template lang="pug">

.markdown-page(name="markdown-page")

  .col#col-main

    previous-button

    .main-container.background-white

      .container

        markdown-renderer

</template>

<script>
  import MarkdownRenderer from '@/components/MarkdownRenderer';
  import PreviousButton from '@/components/PreviousButton';
  
  export default {
    name: 'markdown',
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.$store.commit('SET_NAV_STATE', {
          minimized: false
        });
        vm.$store.commit('SET_PAGE_STYLE', undefined);
      });
    },
    components: {
      MarkdownRenderer,
      PreviousButton,
    },
  };
</script>