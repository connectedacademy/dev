<template lang="pug">

.home-page(name="home-page")

  .col#col-main
    
    .main-container

      .content-block.header-block.unpadded-block.white-block
        video-embed(v-bind:video-src="`${videoSrc}?modestbranding=1&autohide=1&showinfo=0&controls=0`" autoLoad)

        #details-container
          h2 {{ course.title }}
          markdown-renderer(v-bind:markdown-url="markdownUrl")
          router-link.pure-button.pure-button-info.rounded-tall(v-bind:to="{ name: 'schedule' }") Start course

</template>

<script>
import { mapGetters } from 'vuex'

// Mixins
import PageStyle from '@/mixins/PageStyle'

// Components
import VideoEmbed from '@/components/VideoEmbed'
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer'

export default {
  name: 'home',
  mixins: [ PageStyle ],
  components: {
    VideoEmbed,
    MarkdownRenderer
  },
  data() {
    return {
      navTitle: 'Home - Connected Academy',
      pageStyle: { type: undefined, visible: true, minimized: false },
      videoSrc: '5GX37R0v8D0'
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
  .video-container
    radius(10px)
    margin 0
    overflow hidden
  #details-container
    padding 0px 20px 20px 20px
    text-align center
</style>
