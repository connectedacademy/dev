<template lang="pug">

.course-content-wrapper

  .course-content-group(v-if="isIntroduction")

    //- ABOUT
    .course-content(v-if="infoMarkdown")
      .course-content--header
        h1.content-title About the course

      .course-content--body
        markdown-renderer(v-bind:markdown-url="infoMarkdown")

        four-corners-link(message="During this course you will use FourCorners to submit images as 'homework', this will allow you to add rich metadata to your images.")

    join-banner

  .course-content-wrapper(v-else)

    .course-content-group
      join-banner

    .course-content-group(v-for="(content, index) in releasedContent" v-bind:class="{ optional: content.optional, [content.status.toLowerCase()]: true }")

      //- QUESTION
      injected-question(v-if="content.content_type === 'question'" v-bind:slug="content.slug")

      //- HOMEWORK
      homework(v-else-if="content.expectsubmission" v-bind:content="content")

      //- FOURCORNERS
      four-corners(v-else-if="content.fourcornersintro")

      //- LIVECLASS
      live-class(v-else-if="content.content_type === 'class'" v-bind:content="content" v-bind:id="'course-content-' + content.slug")

      //- CONTENT
      .course-content(v-else v-bind:class="{ optional: content.optional }" v-bind:id="'course-content-' + content.slug")

        like-indicator(v-bind:content-slug="content.slug" v-bind:class-slug="currentClass.slug" v-bind:haveliked="content.haveliked" v-bind:likes="content.likes" v-bind:has-liked.sync="content.haveliked" v-bind:like-count.sync="content.likes")

        .course-content--header
          h1.content-title(v-if="content.title")
            | {{ content.title }}

        .course-content--body

          p.content-description(v-if="content.description")
            markdown-content(v-bind:markdown="content.description")

          media-thumbnails(v-if="content.thumbnails" v-bind:thumbnails="content.thumbnails")

          media-carousel(v-if="content.carousel" v-bind:media="content.carousel")

          video-embed(v-if="content.video && (content.content_type !== 'class')" v-bind:video-src="content.video" v-bind:content-type="content.content_type")
          
          soundcloud-embed(v-if="content.soundcloud && (content.content_type !== 'class')" v-bind:soundcloud-src="content.soundcloud")

          webinar-message-ticker(v-if="content.content_type === 'webinar'" v-bind:class-slug="currentClass.slug" v-bind:content-slug="content.slug")

          message-composer(v-if="content.content_type === 'webinar'" v-bind:section="content.slug")

        .course-content--footer(v-if="(content.expectsubmission || (content.url && !content.thumbnails))")
          markdown-link.pull-right(v-bind:md-content="content" v-if="content.url && !content.thumbnails")
          .clearfix

    .course-content-group.course-content-group--future(v-for="(content, index) in futureContent" v-bind:class="{ optional: content.optional, [content.status.toLowerCase()]: true }" v-show="index === 0")

      //- FUTURE CONTENT
      future-content(v-if="content.content_type !== 'nextclass'" v-bind:content="content")
      
      //- NEXT CLASS
      next-class(v-if="content.content_type === 'nextclass'" v-bind:content="content")

</template>

<script>
import filter from 'lodash/filter';
import { mapGetters } from 'vuex';
import Auth from '@/mixins/Auth';

import MarkdownRenderer from '@/components/MarkdownRenderer';

export default {
  name: 'course-content',
  mixins: [
    Auth,
  ],
  components: {
    MarkdownRenderer,
    'MarkdownContent': () => import('@/components/MarkdownContent'),
    'MarkdownLink': () => import('@/components/MarkdownLink'),
    'SoundcloudEmbed': () => ({
      component: import('@/components/SoundcloudEmbed'),
      delay: 2000,
    }),
    'VideoEmbed': () => ({
      component: import('@/components/VideoEmbed'),
      delay: 2000,
    }),
    'LikeIndicator': () => import('@/components/LikeIndicator'),
    'LiveClass': () => import('@/components/conversation/LiveClass'),
    'Homework': () => import('@/components/conversation/Homework'),
    'FourCorners': () => import('@/components/conversation/FourCorners'),
    'FutureContent': () => import('@/components/conversation/FutureContent'),
    'InjectedQuestion': () => import('@/components/conversation/InjectedQuestion'),
    'NextClass': () => import('@/components/conversation/NextClass'),
    'WebinarMessageTicker': () => import('@/components/webinar/WebinarMessageTicker'),
    'JoinBanner': () => import('@/components/banners/JoinBanner'),
    'MessageComposer': () => import('@/components/MessageComposer'),
    'FourCornersLink': () => import('@/components/fourcorners/FourCornersLink'),
    'MediaCarousel': () => import('@/components/MediaCarousel'),
    'MediaCarousel': () => ({
      component: import('@/components/MediaCarousel'),
      delay: 2000,
    }),
    'MediaThumbnails': () => ({
      component: import('@/components/MediaThumbnails'),
      delay: 2000,
    })
  },
  
  created() {
    this.viewCurrentClass();    
  },
  watch: {
    course() {
      this.viewCurrentClass();
    }
  },
  computed: {
    ...mapGetters([
      'course', 'currentClass', 'courseContent'
    ]),
    infoMarkdown() {
      if (!this.course.baseUri) return undefined;
      return `${this.course.baseUri}/info.md`
    },
    isIntroduction() {
      return (this.currentClass && (this.currentClass.slug === 'intro'));
    },
    releasedContent() {
      return filter(this.courseContent, { status: 'RELEASED' });
    },
    futureContent() {
      return filter(this.courseContent, { status: 'FUTURE' });
    },
  },
  methods: {
    viewCurrentClass() {
      if (!this.course) { return; }
      for (const theClass of this.course.classes) {
        if (theClass.status === 'CURRENT') {
          this.$store.dispatch('getSpec', theClass.slug);
        }
      }
    }
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/layout/course-content'

</style>
