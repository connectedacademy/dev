<template lang="pug">

.markdown-page(name="markdown-page")
  .content-block.padded-block.header-block.white-block
    markdown-renderer
    router-link.pure-button.pure-button-white(:to="{ name: 'content' }") #[icon(icon="angle-left")]Back to class

</template>

<script>
import { mapGetters } from 'vuex'
import { Events } from '@/events.js'

// Mixins
import PageStyle from '@/mixins/PageStyle'

// Components
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer'

export default {
  name: 'markdown',
  mixins: [ PageStyle ],
  components: {
    MarkdownRenderer
  },
  mounted() {
    this.$logging.logEvent('markdown', 'rendered', window.location.href)
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/buttons'

.markdown-page
  .markdown-wrapper
    margin-bottom 20px

</style>
