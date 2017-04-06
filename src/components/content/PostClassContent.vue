<template lang="pug">

  .course-content-wrapper
    .course-content.post-class-content(v-for="content in coursePostClassContent")
      h1 {{ content.title }}
      a(v-bind:href="content.url" target="_blank") {{ content.url }}

</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'post-class-content',
  computed: {
    ...mapGetters([
      'coursePostClassContent',
    ]),
  },
};
</script>

<style lang="stylus">

@import "../../assets/stylus/layout/course-content"

</style>
