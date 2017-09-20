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
import * as types from '@/store/mutation-types';
import Moment from 'moment-mini';
import Auth from '@/mixins/Auth';

import MarkdownRenderer from '@/components/MarkdownRenderer';
import MarkdownContent from '@/components/MarkdownContent';
import MarkdownLink from '@/components/MarkdownLink';
import SoundcloudEmbed from '@/components/SoundcloudEmbed';
import VideoEmbed from '@/components/VideoEmbed';
import LikeIndicator from '@/components/LikeIndicator';

import LiveClass from '@/components/conversation/LiveClass';
import Homework from '@/components/conversation/Homework';
import FourCorners from '@/components/conversation/FourCorners';
import FutureContent from '@/components/conversation/FutureContent';
import InjectedQuestion from '@/components/conversation/InjectedQuestion';
import NextClass from '@/components/conversation/NextClass';
import WebinarMessageTicker from '@/components/webinar/WebinarMessageTicker';
import JoinBanner from '@/components/banners/JoinBanner';

import MediaCarousel from '@/components/MediaCarousel';
import MediaThumbnails from '@/components/MediaThumbnails';

import MessageComposer from '@/components/MessageComposer';
import FourCornersLink from '@/components/fourcorners/FourCornersLink';

export default {
  name: 'course-content',
  mixins: [
    Auth,
  ],
  props: ['courseContent'],
  components: {
    LiveClass,
    MarkdownContent,
    MarkdownLink,
    VideoEmbed,
    SoundcloudEmbed,
    LikeIndicator,
    Homework,
    FourCorners,
    FutureContent,
    MarkdownRenderer,
    InjectedQuestion,
    NextClass,
    MessageComposer,
    WebinarMessageTicker,
    JoinBanner,
    MediaCarousel,
    MediaThumbnails,
    FourCornersLink,
  },
  created() {
    this.$store.dispatch('getCourse');
  },
  watch: {
    course() {
      this.viewCurrentClass();
    }
  },
  computed: {
    ...mapGetters([
      'course', 'currentClass'
    ]),
    infoMarkdown() {
      if (!this.course.baseUri) return undefined;
      return `${this.course.baseUri}/info.md`
    },
    isIntroduction() {
      return (this.currentClass && (this.currentClass.slug === 'intro'));
    },
    releasedContent() {
      return filter(this.courseContent, (o) => {
        return (o.status === 'RELEASED');
      });
    },
    futureContent() {
      return filter(this.courseContent, (o) => {
        return ((o.status === 'FUTURE')); //  && (o.content_type !== 'nextclass')
      });
    },
  },
  methods: {
    showAuth() {
      this.$store.commit(types.SHOW_AUTH);
    },
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
