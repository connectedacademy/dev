<template lang="pug">

.soundcloud-wrapper

  .soundcloud-container
    iframe(v-bind:src="src" width="100%" height="166" scrolling="no" frameborder="no")

</template>

<script>
export default {
  name: 'soundcloud-embed',
  props: ['soundcloudSrc'],
  computed: {
    src() {
      return `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${this.soundcloudSrc}`;
    },
  },
};
</script>

<style lang="stylus" scoped>

.soundcloud-wrapper
  .soundcloud-container
    margin-bottom 20px
    position relative

</style>
