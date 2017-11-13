<template lang="pug">
.course-content(v-bind:name="`section-${content.slug}`" v-bind:class="{ optional: content.optional }" v-bind:id="'course-content-' + content.slug")

  like-indicator(v-bind:content-slug="content.slug" v-bind:class-slug="currentClass.slug" v-bind:haveliked="content.haveliked" v-bind:likes="content.likes" v-bind:has-liked.sync="content.haveliked" v-bind:like-count.sync="content.likes")

  .course-content--header
    h1.content-title(v-if="content.title") {{ content.title }}

  .course-content--body
    markdown-content(v-if="content.description" v-bind:markdown="content.description")
    media-carousel(v-if="content.carousel" v-bind:media="content.carousel")
    media-thumbnails(v-if="content.thumbnails" v-bind:thumbnails="content.thumbnails")
    soundcloud-embed(v-if="content.soundcloud && (content.content_type !== 'class')" v-bind:soundcloud-src="content.soundcloud" v-bind:auto-load="true")
    video-embed(v-if="content.video && (content.content_type !== 'class')" v-bind:video-src="content.video" v-bind:content-type="content.content_type")
    webinar-message-ticker(v-if="content.content_type === 'webinar'" v-bind:class-slug="currentClass.slug" v-bind:content-slug="content.slug")

  .course-content--footer(v-if="content.hasContent && !content.thumbnails")
    markdown-link.pull-right(v-bind:md-content="content")
    .clearfix

</template>

<script>
import LikeIndicator from '@/components/LikeIndicator'
import MarkdownContent from '@/components/MarkdownContent'
import MarkdownLink from '@/components/MarkdownLink'
import MediaCarousel from '@/components/MediaCarousel'
import MediaThumbnails from '@/components/MediaThumbnails'
import SoundcloudEmbed from '@/components/SoundcloudEmbed'
import VideoEmbed from '@/components/VideoEmbed'
import WebinarMessageTicker from '@/components/webinar/WebinarMessageTicker'

export default {
  name: 'deep-dive',
  props: ['content', 'currentClass'],
  components: {
    LikeIndicator,
    MarkdownContent,
    MarkdownLink,
    MediaCarousel,
    MediaThumbnails,
    SoundcloudEmbed,
    VideoEmbed,
    WebinarMessageTicker,
  }
}
</script>

<style lang="stylus" scoped>

</style>
