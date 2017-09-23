<template lang="pug">

.course-content-wrapper

  .course-content-group(v-for="(content, index) in releasedContent" v-bind:key="index" v-bind:class="{ optional: content.optional, [content.status.toLowerCase()]: true }")

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

      .course-content--footer(v-if="(content.expectsubmission || (content.hasContent && !content.thumbnails))")
        markdown-link.pull-right(v-bind:md-content="content" v-if="content.hasContent && !content.thumbnails")
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

export default {
  name: 'course-content',
  mixins: [
    Auth,
  ],
  components: {
    JoinBanner: () => import('@/components/banners/JoinBanner'),
    MarkdownContent: () => import(/* webpackChunkName: "group-course" */ '@/components/MarkdownContent'),
    MarkdownLink: () => import(/* webpackChunkName: "group-course" */ '@/components/MarkdownLink'),
    SoundcloudEmbed: () => import('@/components/SoundcloudEmbed'),
    VideoEmbed: () => import('@/components/VideoEmbed'),
    LikeIndicator: () => import(/* webpackChunkName: "group-course" */ '@/components/LikeIndicator'),
    LiveClass: () => import('@/components/conversation/LiveClass'),
    Homework: () => import(/* webpackChunkName: "group-course" */ '@/components/conversation/Homework'),
    FourCorners: () => import(/* webpackChunkName: "group-course" */ '@/components/conversation/FourCorners'),
    FutureContent: () => import(/* webpackChunkName: "group-course" */ '@/components/conversation/FutureContent'),
    InjectedQuestion: () => import('@/components/conversation/InjectedQuestion'),
    NextClass: () => import('@/components/conversation/NextClass'),
    WebinarMessageTicker: () => import('@/components/webinar/WebinarMessageTicker'),
    MediaCarousel: () => import('@/components/MediaCarousel'),
    MediaThumbnails: () => import('@/components/MediaThumbnails')
  },
  mounted() {
    this.viewCurrentClass();
  },
  watch: {
    course(nV) {
      this.viewCurrentClass();
    }
  },
  computed: {
    ...mapGetters([
      'course', 'currentClass', 'courseContent'
    ]),
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
