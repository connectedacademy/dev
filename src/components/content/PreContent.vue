<template lang="pug">

  .course-content-wrapper

    .course-content.pre-content(v-for="content in coursePreContent" v-bind:class="{ optional: content.optional }")

      like-indicator(v-bind:content="content")

      .course-content--header
        h1.content-title {{ content.title }}

      .course-content--body
        p.content-description {{ content.description }}

        video-thumbnail(:video-src="content.video" v-if="content.video" )

      .course-content--footer
        markdown-link.pull-right(v-bind:md-content="content" v-if="content.url")
        .clearfix

</template>

<script>
import { mapGetters } from 'vuex';

import MarkdownLink from '../MarkdownLink';
import VideoThumbnail from '../VideoThumbnail';
import LikeIndicator from '../LikeIndicator';

export default {
  name: 'pre-content',
  computed: {
    ...mapGetters([
      'coursePreContent',
    ]),
  },
  components: {
    MarkdownLink,
    VideoThumbnail,
    LikeIndicator,
  },
};
</script>

<style lang="stylus" scoped>

@import "../../assets/stylus/layout/course-content"

</style>
