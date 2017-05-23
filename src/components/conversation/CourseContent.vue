<template lang="pug">

.course-content-wrapper

  .course-content-group.course-content-group--released(v-for="content in releasedContent" v-bind:class="{ optional: content.optional, [content.status.toLowerCase()]: true }")

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
import MarkdownLink from '../MarkdownLink';
import VideoThumbnail from '../VideoThumbnail';
import ConversationContainer from '../ConversationContainer';
import LikeIndicator from '../LikeIndicator';
import SubmissionGrid from '../SubmissionGrid';
import SubmissionButton from '../SubmissionButton';
import FutureContent from './FutureContent';

export default {
  name: 'course-content',
  computed: {
    ...mapGetters([
      'courseContent', 'currentSection', 'isRegistered', 'currentActiveSection',
    ]),
    releasedContent() {
      return _.filter(this.courseContent, { status: 'RELEASED' });
    },
    futureContent() {
      return _.filter(this.courseContent, { status: 'FUTURE' });
    },
  },
  data() {
    return {};
  },
  methods: {
    showAuth() {
      this.$store.commit(types.SHOW_AUTH);
    },
  },
  components: {
    ConversationContainer,
    MarkdownLink,
    VideoThumbnail,
    LikeIndicator,
    SubmissionGrid,
    SubmissionButton,
    FutureContent,
  },
};
</script>

<style lang="stylus" scoped>

@import "../../assets/stylus/layout/course-content"

</style>
