<template lang="pug">

.markdown-page(name="markdown-page")
  .content-block.padded-block.header-block.white-block
    markdown-renderer
    router-link.pure-button.pure-button-white(:to="{ name: 'content' }") #[i.fas.fa-angle-left]Back to class

</template>

<script>
import { mapGetters } from 'vuex'

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
  },
  data() {
    return {
      pageStyle: { type: undefined, visible: true, minimized: false }
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/buttons'

.pure-button
  margin-top 20px
</style>
