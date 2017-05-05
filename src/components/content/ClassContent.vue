<template lang="pug">

  .course-content-wrapper(v-bind:class="{ 'active': isActive }" v-if="content")

    .course-content.class-content(v-bind:class="{ optional: content.optional }")

      .course-content--header
        h1.content-title {{ content.title }}

      .course-content--body
        p.content-description {{ content.description }}

        video-thumbnail(:video-src="content.video" v-if="content.video" )

      .course-content--footer
        .pure-button.pure-button-primary.pull-right(v-if="!isRegistered" @click="showAuth") {{ $t('auth.login_to_participate') }}
        .clearfix

      conversation-container(v-if="isRegistered" v-bind:content="content")

</template>

<script>
/* eslint-disable */
import _ from 'lodash';
import { mapGetters } from 'vuex';

import * as types from '../../store/mutation-types';
import MarkdownLink from '../MarkdownLink';
import VideoThumbnail from '../VideoThumbnail';
import ConversationContainer from '../ConversationContainer';

export default {
  name: 'class-content',
  computed: {
    ...mapGetters([
      'courseClassContent', 'currentSection', 'isRegistered',
    ]),
    isActive() {
      return (typeof this.currentSection != 'undefined' && this.currentSection.slug === this.slug);
    },
    content() {
      return this.courseClassContent;
    },
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      slug: undefined,
    };
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
  },
};
</script>

<style lang="stylus" scoped>

@import "../../assets/stylus/layout/course-content"

</style>
