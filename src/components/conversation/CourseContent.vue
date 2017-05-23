<template lang="pug">

.course-content-wrapper

  .course-content-group(v-for="content in courseContent" v-bind:class="{ optional: content.optional }")

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

export default {
  name: 'course-content',
  computed: {
    ...mapGetters([
      'courseContent', 'currentSection', 'isRegistered', 'currentActiveSection',
    ]),
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
  },
};
</script>

<style lang="stylus" scoped>

@import "../../assets/stylus/layout/course-content"

</style>
