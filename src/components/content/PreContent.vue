<template lang="pug">

  .course-content-wrapper

    pre.hidden {{ coursePreContent }}

    .course-content.pre-content(v-for="content in coursePreContent" v-bind:class="{ optional: content.optional }")

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

export default {
  name: 'webinar-content',
  computed: {
    ...mapGetters([
      'coursePreContent',
    ]),
  },
  components: {
    MarkdownLink,
    VideoThumbnail,
  },
};
</script>

<style lang="stylus" scoped>

@import "../../assets/stylus/layout/course-content"

</style>
