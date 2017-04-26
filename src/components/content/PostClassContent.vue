<template lang="pug">

  .course-content-wrapper

    .course-content.postclass-content(v-for="content in coursePostClassContent" v-bind:class="{ optional: content.optional }")

      .course-content--header
        h1.content-title {{ content.title }}

      .course-content--body
        p.content-description {{ content.description }}

        video-thumbnail(:video-src="content.video" v-if="content.video" )

        markdown-link(v-bind:md-content="content" v-if="content.url")

</template>

<script>
import { mapGetters } from 'vuex';

import MarkdownLink from '../MarkdownLink';
import VideoThumbnail from '../VideoThumbnail';

export default {
  name: 'post-class-content',
  computed: {
    ...mapGetters([
      'coursePostClassContent',
    ]),
  },
  components: {
    MarkdownLink,
    VideoThumbnail,
  },
};
</script>

<style lang="stylus">

@import "../../assets/stylus/layout/course-content"

</style>
