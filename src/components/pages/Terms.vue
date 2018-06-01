<template lang="pug">

.terms-page(name="terms-page")

  .col#col-main
    
    .main-container

      narrow-page-header(title="Terms" subtitle="Our terms and conditions")

      .content-block.padded-block.header-block.white-block

        markdown-renderer(v-bind:markdown-url="markdownUrl")

</template>

<script>
import API from '@/api'
import { mapGetters } from 'vuex'

import MarkdownIt from 'markdown-it'

// Mixins
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer'

// Components
import NarrowPageHeader from '@/components/NarrowPageHeader'
import PageStyle from '@/mixins/PageStyle'

export default {
  name: 'terms',
  mixins: [ PageStyle ],
  components: {
    NarrowPageHeader,
    MarkdownRenderer
  },
  mounted() {
    this.loadTerms()
  },
  data() {
    return {
      pageStyle: { type: undefined, visible: true, minimized: false },
      release: ''
    }
  },
  computed: {
    ...mapGetters(['course']),
    markdownUrl() {
      return `${this.course.cdn}/content/terms`
    }
  }
}

</script>
