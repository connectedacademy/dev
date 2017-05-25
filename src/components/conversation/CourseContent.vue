<template lang="pug">

.course-content-wrapper

  .course-content-group(v-if="currentClass.status === 'RELEASED'")
    .course-content
      .padded-container
        h2 This is not the current class
        .pure-button.pure-button-primary(@click="viewCurrentClass") $t('course.view_current_class') }}

  .padded-container(v-if="currentClass.loading")
    icon(name="refresh" scale="2" spin)

  .course-content-group(v-if="isIntroduction")

    //- ABOUT
    .course-content
      .course-content--header
        h1.content-title About the course

      .course-content--body
        markdown-renderer(markdown-url="https://testclass.connectedacademy.io/course/content/en/info.md")

      .course-content--footer
        .login-button.pure-button.pure-button-primary(v-if="!isRegistered" @click="showAuth") {{ $t('auth.login') }}
        .login-button.pure-button.pure-button-primary.pull-right(v-if="isRegistered" @click="viewCurrentClass") {{ $t('course.view_current_class') }}
        .clearfix

  .course-content-group(v-for="content in releasedContent" v-bind:class="{ optional: content.optional, [content.status.toLowerCase()]: true }")

    //- QUESTION
    .course-content(v-if="content.content_type === 'question'")
      .course-content--header
        h1.content-title Injected Question

      .course-content--body
        p.content-description Question lives here...

    //- CONTENT
    .course-content(v-else v-bind:class="{ optional: content.optional }" v-bind:id="'course-content-' + content.slug")

      .type-indicator(v-bind:title="content.slug" v-bind:class="{ active: (currentActiveSection !== undefined) && (content.slug === currentActiveSection.slug) }")

      like-indicator(v-bind:content="content")

      .course-content--header
        h1.content-title(v-if="content.title") {{ content.title }}

      .course-content--body
        p.content-description(v-if="content.description") {{ content.description }}

        video-thumbnail(v-if="content.video && ((content.content_type !== 'class') && (content.content_type !== 'webinar'))" v-bind:video-src="content.video")

        submission-grid(v-if="content.expectsubmission" v-bind:content="content")

      .course-content--footer(v-if="!isRegistered || content.expectsubmission || content.url")
        markdown-link.pull-right(v-bind:md-content="content" v-if="content.url")
        submission-button(v-bind:content="content")
        .clearfix

      conversation-container(v-if="content.content_type === 'class'" v-bind:content="content")

  .course-content-group.course-content-group--future(v-for="(content, index) in futureContent" v-bind:class="{ optional: content.optional, [content.status.toLowerCase()]: true }" v-if="index === 0")

    //- FUTURE CONTENT
    future-content(v-bind:content="content")

</template>

<script>
/* eslint-disable */
import _ from 'lodash';
import { mapGetters } from 'vuex';
import * as types from '@/store/mutation-types';
import Auth from '@/mixins/Auth';

import MarkdownRenderer from '@/components/MarkdownRenderer';
import MarkdownLink from '@/components/MarkdownLink';
import VideoThumbnail from '@/components/VideoThumbnail';
import ConversationContainer from '@/components/ConversationContainer';
import LikeIndicator from '@/components/LikeIndicator';
import SubmissionGrid from '@/components/SubmissionGrid';
import SubmissionButton from '@/components/SubmissionButton';
import FutureContent from './FutureContent';

export default {
  name: 'course-content',
  mixins: [
    Auth,
  ],
  components: {
    ConversationContainer,
    MarkdownLink,
    VideoThumbnail,
    LikeIndicator,
    SubmissionGrid,
    SubmissionButton,
    FutureContent,
    MarkdownRenderer,
  },
  watch: {
    course(nV, oV) {
      if (this.isRegistered) {
        this.viewCurrentClass();
      }
    }
  },
  // mounted() {
  // },
  computed: {
    ...mapGetters([
      'course', 'currentClass', 'courseContent', 'currentSection', 'isRegistered', 'currentActiveSection',
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
    viewCurrentClass() {
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

@import "../../assets/stylus/layout/course-content"

.padded-container
  padding 40px 0
  text-align center
  width 100%
  h2
    color $color-text-dark-grey
  .fa-icon
    color white
</style>
