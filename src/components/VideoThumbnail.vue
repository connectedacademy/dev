<template lang="pug">

.video-wrapper(v-if="videoSrc")

  a.thumbnail-link(v-bind:href="href" target="_blank")
    img(v-bind:src="thumbnail")

</template>

<script>
export default {
  name: 'video-thumbnail',
  props: ['contentType', 'videoSrc'],
  computed: {
    href() {
      return `http://youtube.com/watch?v=${this.videoSrc}`;
    },
    src() {
      return `http://img.youtube.com/vi/${this.videoSrc}/hqdefault.jpg`;
    },
  },
};
</script>

<style lang="stylus" scoped>

.video-wrapper
  a.thumbnail-link
    img
      display block
      height 100px
      margin-top 10px

</style>
