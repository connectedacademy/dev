<template lang="pug">

  .course-content-wrapper

    pre.hidden {{ coursePreContent }}

    .course-content.pre-content(v-for="content in coursePreContent" v-bind:class="{ optional: content.optional }")

      h1 {{ content.title }}

      video-thumbnail(:video-src="content.video" v-if="content.video" )

      markdown-link(v-bind:md-content="content" v-if="content.url")

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

<style lang="stylus">

@import "../../assets/stylus/layout/course-content"

</style>
