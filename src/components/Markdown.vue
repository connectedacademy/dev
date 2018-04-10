<template lang="pug">

.markdown-page(name="markdown-page")
  .content-block.padded-block.header-block.white-block
    markdown-renderer

</template>

<script>
import { mapGetters } from 'vuex'

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
    this.$logging.logEvent('markdown', 'rendered', window.location.href)
  },
  data() {
    return {
      pageStyle: { type: undefined, visible: true, minimized: false }
    }
  },
  computed: {
    ...mapGetters(['course', 'currentClass'])
  }
}
</script>
