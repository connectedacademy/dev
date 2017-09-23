<template lang="pug">

.soundcloud-wrapper

  //- .soundcloud-container(v-if="theSrc")
    iframe(v-once v-bind:src="theSrc" width="100%" height="166" scrolling="no" frameborder="no")

</template>

<script>
  export default {
    name: 'soundcloud-embed',
    props: ['soundcloudSrc'],
    data() {
      return {
        theSrc: undefined
      }
    },
    mounted() {
      setTimeout(() => {
        this.theSrc = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${this.soundcloudSrc}`;
      }, 5000);
    },
  };
</script>

<style lang="stylus" scoped>

.soundcloud-wrapper
  .soundcloud-container
    margin-top 20px
    position relative

</style>
