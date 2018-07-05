<template lang="pug">
.course-content(:name="`section-${content.slug}`" :class="{ optional: content.optional }")

  like-indicator(:content-slug="content.slug" :class-slug="currentClassSlug" :haveliked="content.haveliked" :likes="content.likes" :has-liked.sync="content.haveliked" :like-count.sync="content.likes")

  .course-content--header
    h1.content-title(v-if="content.title") {{ content.title }}

  .course-content--body
    markdown-content(v-if="content.description" :markdown="content.description")
    media-carousel(v-if="content.carousel" :media="content.carousel")
    media-thumbnails(v-if="content.thumbnails" :thumbnails="content.thumbnails")
    soundcloud-embed(v-if="content.soundcloud && (content.type !== 'class')" :soundcloud-src="content.soundcloud" :auto-load="true")
    video-embed(v-if="content.video && (content.type !== 'class')" :video-src="content.video" :content-type="content.type" :auto-load="true")
    webinar-message-ticker(v-if="content.type === 'webinar'" :class-slug="currentClassSlug" :content-slug="content.slug")

  .course-content--footer(v-if="content.rich")
    markdown-link.pull-right(:md-content="content")
    .clearfix

</template>

<script>
import LikeIndicator from '@/components/LikeIndicator'
import MarkdownContent from '@/components/markdown/MarkdownContent'
import MarkdownLink from '@/components/markdown/MarkdownLink'
import MediaCarousel from '@/components/MediaCarousel'
import MediaThumbnails from '@/components/MediaThumbnails'
import SoundcloudEmbed from '@/components/SoundcloudEmbed'
import VideoEmbed from '@/components/VideoEmbed'
import WebinarMessageTicker from '@/components/webinar/WebinarMessageTicker'

export default {
  name: 'deep-dive',
  props: ['content'],
  components: {
    LikeIndicator,
    MarkdownContent,
    MarkdownLink,
    MediaCarousel,
    MediaThumbnails,
    SoundcloudEmbed,
    VideoEmbed,
    WebinarMessageTicker,
  },
  computed: {
    currentClassSlug() {
      return this.$route.params.classSlug
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/layout/course-content'
  
</style>
