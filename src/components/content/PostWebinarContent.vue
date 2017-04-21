<template lang="pug">

  .course-content-wrapper

    .course-content.postwebinar-content(v-for="content in coursePostWebinarContent" v-bind:class="{ optional: content.optional }")

      h1 {{ content.title }}

      video-thumbnail(:video-src="content.video" v-if="content.video" )

      markdown-link(v-bind:md-content="content" v-if="content.url")

</template>

<script>
import { mapGetters } from 'vuex';

import MarkdownLink from '../MarkdownLink';
import VideoThumbnail from '../VideoThumbnail';

export default {
  name: 'post-webinar-content',
  computed: {
    ...mapGetters([
      'coursePostWebinarContent',
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
