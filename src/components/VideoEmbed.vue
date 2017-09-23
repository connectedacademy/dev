<template lang="pug">

.video-wrapper(v-if="theSrc")

  .video-container
    iframe(v-bind:src="theSrc" frameborder='0' allowfullscreen)

</template>

<script>
import startsWith from 'lodash/startsWith';

export default {
  name: 'video-embed',
  props: ['contentType', 'videoSrc'],
  mounted() {
    setTimeout(() => {
      this.theSrc = this.src;
    }, 2500);
  },
  data() {
    return {
      theSrc: undefined
    }
  },
  computed: {
    src() {
      switch (this.contentType) {
        case 'webinar':
          return (startsWith(this.videoSrc, 'http')) ? this.videoSrc : `https://www.youtube.com/embed/${this.videoSrc}`;
          break;
        default:
          return `https://www.youtube.com/embed/${this.videoSrc}`;
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
