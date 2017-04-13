<template lang="pug">

  a(:href="src" target="_blank")
    img(v-bind:src="thumbnail" width="200")

</template>

<script>
import _ from 'lodash';

export default {
  name: 'video-thumbnail',
  props: ['videoSrc'],
  computed: {
    thumbnail() {
      return `http://img.youtube.com/vi/${this.videoSrc}/hqdefault.jpg`;
    },
    src() {
      return `http://youtube.com/watch?v=${this.videoSrc}`;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import "../assets/stylus/shared/*"

</style>
