<template lang="pug">

  .course-content-wrapper
    .course-content.pre-content(v-for="content in coursePreContent")
      h1 {{ content.title }}
      a(v-bind:href="content.url" target="_blank") {{ content.url }}

</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'webinar-content',
  computed: {
    ...mapGetters([
      'coursePreContent',
    ]),
  },
};
</script>

<style lang="stylus">

@import "../../assets/stylus/layout/course-content"

</style>
