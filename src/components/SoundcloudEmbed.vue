<template lang="pug">

.soundcloud-wrapper
  .loading-wrapper(v-if="!theSrc")
    .pure-button.pure-button-soundcloud(@click="loadEmbed") Click to listen to audio
  .soundcloud-container(v-if="theSrc")
    iframe(v-once v-bind:src="theSrc" width="100%" height="166" scrolling="no" frameborder="no")

</template>

<script>
  export default {
    name: 'soundcloud-embed',
    props: ['soundcloudSrc', 'autoLoad'],
    data() {
      return {
        src: undefined,
        theSrc: undefined
      }
    },
    mounted() {
      this.src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${this.soundcloudSrc}`;
      if (this.autoLoad) {
        setTimeout(() => {
          this.theSrc = this.src;
        }, 1000);
      }
    },
    methods: {
      loadEmbed() {
        this.theSrc = this.src;
        this.$ga.event('soundcloud-embed', 'embed-loaded', this.src);
      },
    },
  };
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

.soundcloud-wrapper
  .loading-wrapper
    background-color white // $color-lighter-grey
    margin-top 15px
    margin-bottom 10px
    padding 58px 20px
    text-align center
  .soundcloud-container
    margin-top 20px
    position relative

</style>
