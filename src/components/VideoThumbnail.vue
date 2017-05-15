<template lang="pug">

  a.thumbnail-link(:href="src" target="_blank")
    img(v-bind:src="thumbnail")

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

a.thumbnail-link
  img
    display block
    height 100px
    margin-top 10px
</style>
