<template lang="pug">

.soundcloud-wrapper
  .loading-wrapper(v-if="!theSrc")
    .pure-button.pure-button-success(@click="loadEmbed") Click to load
  .soundcloud-container(v-if="theSrc")
    iframe(v-once v-bind:src="theSrc" width="100%" height="166" scrolling="no" frameborder="no")

</template>

<script>
  export default {
    name: 'soundcloud-embed',
    props: ['soundcloudSrc'],
    data() {
      return {
        src: undefined,
        theSrc: undefined
      }
    },
    mounted() {
      setTimeout(() => {
        this.src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${this.soundcloudSrc}`;
      }, 2500);
    },
    methods: {
      loadEmbed() {
        this.theSrc = this.src;
      },
    },
  };
</script>

<style lang="stylus" scoped>

.soundcloud-wrapper
  .loading-wrapper
    background-color #f2f2f2
    margin-top 25px
    margin-bottom 10px
    padding 58px 20px
    text-align center
  .soundcloud-container
    margin-top 20px
    position relative

</style>
