<template lang="pug">

  .course-content-wrapper

    .course-content.class-content(v-for="content in courseWebinarContent" v-bind:class="{ optional: content.optional }")

      h1 {{ content.title }}

      video-thumbnail(:video-src="content.video" v-if="content.video" )

      video-container(:video-src="content.video")

      conversation-container

</template>

<script>
import { mapGetters } from 'vuex';

import MarkdownLink from '../MarkdownLink';
import VideoContainer from '../VideoContainer';
import VideoThumbnail from '../VideoThumbnail';
import ConversationContainer from '../ConversationContainer';

export default {
  name: 'class-content',
  computed: {
    ...mapGetters([
      'courseWebinarContent',
    ]),
  },
  components: {
    ConversationContainer,
    MarkdownLink,
    VideoContainer,
    VideoThumbnail,
  },
};
</script>

<style lang="stylus" scoped>

@import "../../assets/stylus/layout/course-content"

</style>
