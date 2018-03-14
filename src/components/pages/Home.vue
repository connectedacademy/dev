<template lang="pug">

.home-page(name="home-page")

  .col#col-main
    
    .main-container

      narrow-page-header(title="Introduction" subtitle="Welcome to Connected Academy.")

      .content-block.header-block.unpadded-block.white-block

        video-embed(video-src="FLY5HaiYDqE?modestbranding=1&autohide=1&showinfo=0&controls=0" autoLoad)
        #details-container
          markdown-renderer(v-bind:markdown-url="markdownUrl")
          router-link.pure-button.pure-button-info.rounded-tall(v-bind:to="{ name: 'schedule' }") Explore content

</template>

<script>
import { mapGetters } from 'vuex'

// Mixins
import PageStyle from '@/mixins/PageStyle'

// Components
import VideoEmbed from '@/components/VideoEmbed'
import NarrowPageHeader from '@/components/NarrowPageHeader'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export default {
  name: 'home',
  mixins: [ PageStyle ],
  components: {
    VideoEmbed,
    NarrowPageHeader,
    MarkdownRenderer
  },
  data() {
    return {
      navTitle: 'Home - Connected Academy',
      pageStyle: { type: undefined, visible: true, minimized: false }
    }
  },
  computed: {
    ...mapGetters(['course']),
    markdownUrl() {
      return `${this.course.baseUri}welcome.md`
    }
  }
}

</script>

<style lang="stylus" scoped>

@import '~stylus/buttons'

.home-page
  text-align center
  .video-container
    margin 0
  #details-container
    padding 0px 20px 20px 20px
</style>
