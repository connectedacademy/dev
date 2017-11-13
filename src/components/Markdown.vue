<template lang="pug">

.markdown-page(name="markdown-page")

  .col#col-main

    //- previous-button

    .main-container.background-white

      .container

        markdown-renderer

</template>

<script>
  // Mixins
  import PageStyle from '@/mixins/PageStyle';
  
  // Components
  import MarkdownRenderer from '@/components/MarkdownRenderer';
  import PreviousButton from '@/components/PreviousButton';
  
  export default {
    name: 'markdown',
    mixins: [ PageStyle ],
    components: {
      MarkdownRenderer,
      PreviousButton,
    },
    mounted() {
      this.$ga.event('markdown', 'rendered', window.location.href);
    },
    data() {
      return {
        pageStyle: { type: undefined, minimized: false }
      }
    }
  };
</script>