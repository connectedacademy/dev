<template lang="pug">

  .course-content-wrapper

    .course-content.class-content(v-for="content in courseClassContent" v-bind:class="{ optional: content.optional }")

      .course-content--header
        h1.content-title {{ content.title }}

      .course-content--body
        p.content-description {{ content.description }}

        video-thumbnail(:video-src="content.video" v-if="content.video" )

      .course-content--footer
        .pure-button.pure-button-primary.pull-right(@click="showAuth") Login to Participate
        .clearfix

      video-container(:video-src="content.video")

      conversation-container

</template>

<script>
import { mapGetters } from 'vuex';

import * as types from '../../store/mutation-types';
import MarkdownLink from '../MarkdownLink';
import VideoContainer from '../VideoContainer';
import VideoThumbnail from '../VideoThumbnail';
import ConversationContainer from '../ConversationContainer';

export default {
  name: 'class-content',
  computed: {
    ...mapGetters([
      'courseClassContent',
    ]),
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
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
    VideoContainer,
    VideoThumbnail,
  },
};
</script>

<style lang="stylus">

@import "../../assets/stylus/layout/course-content"

</style>
