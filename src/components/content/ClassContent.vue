<template lang="pug">

  .course-content-wrapper

    .course-content.class-content(v-for="content in courseClassContent")

      h1 {{ content.title }}

      img(v-bind:src="content.video | thumbnail" width="200")

      video-container(:video-src="content.video")

      conversation-container

</template>

<script>
import { mapGetters } from 'vuex';

import VideoContainer from '../VideoContainer';
import ConversationContainer from '../ConversationContainer';

export default {
  name: 'class-content',
  computed: {
    ...mapGetters([
      'courseClassContent',
    ]),
  },
  filters: {
    thumbnail(video) {
      return `http://img.youtube.com/vi/${video}/hqdefault.jpg`;
    },
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
    };
  },
  components: {
    ConversationContainer,
    VideoContainer,
  },
};
</script>

<style lang="stylus">

@import "../../assets/stylus/layout/course-content"

</style>
