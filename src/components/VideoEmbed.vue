<template lang="pug">

.video-wrapper(v-if="videoSrc")

  .video-container
    iframe(v-bind:src="src" frameborder='0' allowfullscreen)

</template>

<script>
export default {
  name: 'video-embed',
  props: ['contentType', 'videoSrc'],
  computed: {
    type() {
      if (this.contentType === 'webinar') {
        return 'live';
      } else {
        return 'default';
      }
    },
    href() {
      return `http://youtube.com/watch?v=${this.videoSrc}`;
    },
    src() {
      switch (this.type) {
        case 'default':
          return `https://www.youtube.com/embed/${this.videoSrc}`;
          break;
        case 'live':
          return this.videoSrc;
          break;
        default:
          return this.videoSrc;
      }
    },
  },
};
</script>

<style lang="stylus" scoped>

.video-wrapper
  .video-container
    margin-bottom 20px
    position relative
    padding-bottom 56.25%
    height 0
    overflow hidden
    max-width 100%

    iframe, object, embed
      position absolute
      top 0
      left 0
      width 100%
      height 100%

</style>
