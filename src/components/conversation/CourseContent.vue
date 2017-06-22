<template lang="pug">

.course-content-wrapper

  .course-content-group(v-if="isIntroduction")

    //- ABOUT
    .course-content
      .course-content--header
        h1.content-title About the course

      .course-content--body
        markdown-renderer(markdown-url="https://testclass.connectedacademy.io/course/content/en/info.md")

      .course-content--footer
        .pure-button.pure-button-success.pull-right(v-if="isRegistered" @click="startDemo") Start Demo
        .login-button.pure-button.pure-button-primary.pull-right(v-else @click="showAuth") {{ $t('auth.login') }}
        //- .pure-button.pure-button-primary.pull-right(v-if="isRegistered" @click="viewCurrentClass") {{ $t('course.view_current_class') }}
        .clearfix

  .course-content-group(v-for="content in releasedContent" v-bind:class="{ optional: content.optional, [content.status.toLowerCase()]: true }")

    //- QUESTION
    injected-question(v-if="content.content_type === 'question'" v-bind:slug="content.slug")

    //- HOMEWORK
    homework(v-else-if="content.expectsubmission && isRegistered" v-bind:content="content")

    //- FOURCORNERS
    four-corners(v-else-if="content.fourcornersintro")

    //- LIVECLASS
    live-class(v-else-if="content.content_type === 'class'" v-bind:content="content" v-bind:id="'course-content-' + content.slug")

    //- CONTENT
    .course-content(v-else v-bind:class="{ optional: content.optional }" v-bind:id="'course-content-' + content.slug")

      //- .type-indicator(v-bind:title="content.slug" v-bind:class="{ active: (currentActiveSection !== undefined) && (content.slug === currentActiveSection.slug) }")

      like-indicator(v-bind:content="content")

      .course-content--header
        h1.content-title(v-if="content.title")
          | {{ content.title }}

      .course-content--body

        p.content-description(v-if="content.description")
          markdown-content(v-bind:markdown="content.description")

        .md-thumbnail-row(v-if="content.thumbnails")
          router-link(v-for="thumbnail in content.thumbnails" v-bind:to="thumbnail.link" v-bind:key="thumbnail.link")
            .md-thumbnail(v-bind:style="{ 'background-image': `url('${thumbnail.image}')` }")
          .clearfix

        video-embed(v-if="content.video && (content.content_type !== 'class')" v-bind:video-src="content.video" v-bind:content-type="content.content_type")

        message-composer(v-if="content.content_type === 'webinar'" v-bind:section="content.slug")

      .course-content--footer(v-if="isRegistered && (content.expectsubmission || (content.url && !content.thumbnails))")
        markdown-link.pull-right(v-bind:md-content="content" v-if="content.url && !content.thumbnails")
        .clearfix

  .course-content-group.course-content-group--future(v-for="(content, index) in futureContent" v-bind:class="{ optional: content.optional, [content.status.toLowerCase()]: true }" v-if="index === 0")

    //- FUTURE CONTENT
    future-content(v-bind:content="content")

</template>

<script>
/* eslint-disable */
import _ from 'lodash';
import { mapGetters } from 'vuex';
import * as types from '@/store/mutation-types';
import Moment from 'moment';
import Auth from '@/mixins/Auth';

import MarkdownRenderer from '@/components/MarkdownRenderer';
import MarkdownContent from '@/components/MarkdownContent';
import MarkdownLink from '@/components/MarkdownLink';
import VideoEmbed from '@/components/VideoEmbed';
import LikeIndicator from '@/components/LikeIndicator';

import LiveClass from '@/components/conversation/LiveClass';
import Homework from '@/components/conversation/Homework';
import FourCorners from '@/components/conversation/FourCorners';
import FutureContent from '@/components/conversation/FutureContent';
import InjectedQuestion from '@/components/conversation/InjectedQuestion';

import MessageComposer from '@/components/MessageComposer';

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
    LikeIndicator,
    Homework,
    FourCorners,
    FutureContent,
    MarkdownRenderer,
    InjectedQuestion,
    MessageComposer,
  },
  mounted() {
    // setTimeout(this.startDemo, 500).bind(this);
  },
  computed: {
    ...mapGetters([
      'course', 'currentClass', 'currentSection', 'isRegistered', 'currentActiveSection', 'fauxTime'
    ]),
    isIntroduction() {
      return (this.currentClass && (this.currentClass.slug === 'intro'));
    },
    releasedContent() {
      return _.filter(this.courseContent, { status: 'RELEASED' });
    },
    futureContent() {
      return _.filter(this.courseContent, { status: 'FUTURE' });
    },
  },
  methods: {
    showAuth() {
      this.$store.commit(types.SHOW_AUTH);
    },
    startDemo() {
      this.$ga.event('demo-button', 'click', 'started-demo', true);
      this.$store.dispatch('getCourse').then(() => {
        setTimeout(this.viewCurrentClass, 500);
      });
    },
    viewCurrentClass() {
      if (!this.course) { return; }
      for (const theClass of this.course.classes) {
        if (theClass.status === 'CURRENT') {
          window.scroll(0, 0);
          this.$store.dispatch('getSpec', theClass.slug);
        }
      }
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/layout/course-content'
.md-thumbnail-row
  height 120px
  margin 15px 0
  overflow-x scroll
  overflow-y hidden
  position relative
  white-space nowrap
  &::-webkit-scrollbar
    display none
  .md-thumbnail
    animate()
    background-image()
    box-sizing border-box
    display inline-block
    height 0
    margin 10px
    padding 5px
    padding-bottom 100px
    position relative
    white-space nowrap
    width 160px
    &:hover
      cursor pointer
      transform scale(1.1)

</style>
