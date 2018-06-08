<template lang="pug">
  .audio-snippet(v-if="sound" :class="{ playing: playing }")
    .progress(:style="{ right: `${100 - progress}%` }")
    .controls
      .control.play(@click="toggleAudio")
        span.playing(v-show="playing")
          i.fas.fa-pause
        span.paused(v-show="!playing")
          i.fas.fa-play
    .meta
      p.title {{ title }}
    .clearfix
</template>

<script>
require('howler')

export default {
  name: 'audio-snippet',
  props: ['title', 'url'],
  data() {
    return {
      sound: undefined,
      playing: false
    }
  },
  beforeDestroy() {
    try {
      this.sound.unload()
    } catch (error) {
      console.error(error);
    }
  },
  mounted() {
    // Create Howl instance
    this.sound = new Howl({
      src: this.url,
      preload: true,
      html5: true,
      buffer: true,
      onplay: () => {
        this.playing = true
      },
      onpause: () => {
        this.playing = false
      }
    })
  },
  methods: {
    toggleAudio() {
      if (this.playing) {
        this.sound.pause()
      } else {
        this.sound.play()
      }
    }
  },
  computed: {
    progress() {
      if (this.sound && !this.playing) return 0
      let prog = (100 / this.sound.duration()) * this.sound.seek()
      return (prog > 100) ? 0 : prog + 1
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.audio-snippet
  animate()
  background-color darken($color-info, 10%)
  position relative
  p
    reset()
    color white
  svg
    color white
  .controls
    padding 0 20px
    .control
      cursor pointer
  .meta
    max-width 200px
  .progress
    pinned()
    animate()
    background-color $color-pink
    height 4px
    position absolute
    right 100%
    top auto
    z-index 0
  .controls, .meta
    animate()
    height 60px
    line-height 60px
    float left
    position relative
    z-index 1
  &.playing
    background-color darken($color-info, 10%)
    // .controls, .meta

</style>
