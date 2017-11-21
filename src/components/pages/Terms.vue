<template lang="pug">

.terms-page(name="terms-page")

  .col#col-main
    
    .main-container

      narrow-page-header(title="Terms" subtitle="Our terms and conditions")

      .content-block.padded-block.header-block.white-block

        .terms(v-html="termsMarkdown")

</template>

<script>
import API from '@/api'
import { mapGetters } from 'vuex'

import MarkdownIt from 'markdown-it'

// Mixins
import MarkdownRenderer from '@/components/MarkdownRenderer'

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
    termsMarkdown() {

      const md = new MarkdownIt({
        html: true,
        linkify: true,
      })

      return `<div>${md.render(this.release)}</div>`
    },
  },
  methods: {
    loadTerms() {
  
      API.auth.fetchQuestions(
        (response) => {
          this.release = response.release
        },
        (response) => {
          // TODO: Better handle failed request
        }
      )
    }
  }
}

</script>
