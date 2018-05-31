<template lang="pug">

.about-page(name="faq-page")

  .col#col-main
    
    .main-container

      narrow-page-header(title="FAQ" subtitle="Frequently Asked Questions")

      .content-block.padded-block.header-block.white-block

        markdown-renderer(v-bind:markdown-url="markdownUrl")

</template>

<script>
import { mapGetters } from 'vuex'

// Mixins
import PageStyle from '@/mixins/PageStyle'

// Components
import NarrowPageHeader from '@/components/NarrowPageHeader'
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer'

export default {
  name: 'faq',
  mixins: [ PageStyle ],
  components: {
    NarrowPageHeader,
    MarkdownRenderer
  },
  data() {
    return {
      navTitle: 'FAQ - Connected Academy',
      pageStyle: { type: undefined, visible: true, minimized: false }
    }
  },
  computed: {
    ...mapGetters(['course']),
    markdownUrl() {
      return `${this.course.cdn}faq.md`
    }
  }
}

</script>
