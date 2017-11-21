<template lang="pug">

.markdown-page(name="markdown-page")

  .col#col-main

    .main-container.background-white

      .container

        markdown-renderer

</template>

<script>
  // Mixins
  import PageStyle from '@/mixins/PageStyle'
  
  // Components
  import MarkdownRenderer from '@/components/MarkdownRenderer'
  
  export default {
    name: 'markdown',
    mixins: [ PageStyle ],
    components: {
      MarkdownRenderer
    },
    mounted() {
      this.$ga.event('markdown', 'rendered', window.location.href)
    },
    data() {
      return {
        pageStyle: { type: undefined, visible: true, minimized: false }
      }
    }
  }
</script>