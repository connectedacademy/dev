<template lang="pug">

.home-page(name="home-page")

  .col#col-main
    
    .main-container

      .content-block.header-block.unpadded-block.white-block
        video-embed(v-if="course.video" v-bind:video-src="`${course.video}?modestbranding=1&autohide=1&showinfo=0&controls=0`" autoLoad)
        .lead-image(v-if="course.image" :style="{ 'background-image': `url(${course.image})` }")
          .credit(v-if="course.imagecredit") Photo Credit: {{ course.imagecredit }}

        #details-container
          h2 {{ course.title }}
          markdown-renderer(v-bind:markdown-url="markdownUrl")
          router-link.pure-button.pure-button-info.rounded-tall(v-bind:to="{ name: 'schedule' }") Explore course

</template>

<script>
import { mapGetters } from 'vuex'
import _get from 'lodash/get'

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
      pageStyle: { type: undefined, visible: true, minimized: false }
    }
  },
  computed: {
    ...mapGetters(['course', 'CDN']),
    markdownUrl() {
      return `${this.CDN}/content/welcome.md`
    }
  }
}

</script>

<style lang="stylus" scoped>

@import '~stylus/buttons'

.home-page
  .lead-image
    background-image()
    padding-bottom 50%
    position relative
    width 100%
    .credit
      radius(15px)
      background-color alpha(black, 0.1)
      color white
      font-size 0.9em
      line-height 30px
      padding 0 10px
      position absolute
      bottom 10px
      right 10px
      left auto
      text-align center
  .video-container
    radius($corner-radius)
    margin 0
    overflow hidden
  #details-container
    padding 0px 20px 20px 20px
    text-align center
    .pure-button
      margin-top 10px
</style>
