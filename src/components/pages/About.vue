<template lang="pug">

.about-page(name="about-page")

  .col#col-main
    
    .main-container

      narrow-page-header(title="About" subtitle="Learn about Connected Academy")

      .content-block.padded-block.header-block.white-block

        markdown-renderer(v-bind:markdown-url="markdownUrl")

        a.pure-button.pure-button-info(href="https://connectedacademy.io" target="_blank") Learn More

</template>

<script>
import { mapGetters } from 'vuex'

// Mixins
import PageStyle from '@/mixins/PageStyle'

// Components
import NarrowPageHeader from '@/components/NarrowPageHeader'
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer'

export default {
  name: 'about',
  mixins: [ PageStyle ],
  components: {
    NarrowPageHeader,
    MarkdownRenderer
  },
  data() {
    return {
      navTitle: 'About - Connected Academy',
      pageStyle: { type: undefined, visible: true, minimized: false }
    }
  },
  computed: {
    ...mapGetters(['course']),
    markdownUrl() {
      return `${this.course.cdn}about.md`
    }
  }
}

</script>

<style lang="stylus" scoped>

@import '~stylus/buttons'

</style>
