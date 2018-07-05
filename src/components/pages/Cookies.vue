<template lang="pug">

.static-page

  .col#col-main
    
    .main-container

      narrow-page-header(title="Cookies Policy" subtitle="How we use cookies on the site")

      .content-block.padded-block.header-block.white-block

        markdown-renderer(v-bind:markdown-url="markdownUrl")

</template>

<script>
import API from '@/api'
import { mapGetters } from 'vuex'


// Mixins
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer'

// Components
import NarrowPageHeader from '@/components/NarrowPageHeader'
import PageStyle from '@/mixins/PageStyle'

export default {
  name: 'cookies',
  mixins: [ PageStyle ],
  components: {
    NarrowPageHeader,
    MarkdownRenderer
  },
  data() {
    return {
      pageStyle: { type: undefined, visible: true, minimized: false }
    }
  },
  computed: {
    ...mapGetters(['CDN']),
    markdownUrl() {
      return `${this.CDN}/content/${this.$route.name}.md`
    }
  }
}

</script>
