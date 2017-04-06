<template lang="pug">

  .course-content-wrapper
    .course-content.post-webinar-content(v-for="content in coursePostWebinarContent")
      h1 {{ content.title }}
      a(v-bind:href="content.url" target="_blank") {{ content.url }}

</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'post-webinar-content',
  computed: {
    ...mapGetters([
      'coursePostWebinarContent',
    ]),
  },
};
</script>

<style lang="stylus">

@import "../../assets/stylus/layout/course-content"

</style>
