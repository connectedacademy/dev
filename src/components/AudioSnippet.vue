<template lang="pug">
  .snippet(v-if="sound" :class="{ playing: playing, editing: editing }" @click="playAudio")
    #controls
      span.rewind(@click="rewindAudio")
        icon(icon="step-backward")
      span.pause(v-show="playing" @click="pauseAudio")
        icon(icon="pause")
      span.play(v-show="!playing")
        icon(icon="play")
      span.skip
        icon(icon="step-forward")
    #meta
      p.title {{ intro.title }}
    #manage(v-if="editing")
      .pure-button.pure-button-transparent.full-width Remove
    .clearfix
</template>

<script>
require('howler')
import { mapGetters } from 'vuex'

export default {
  name: 'audio-snippet',
  props: ['intro', 'editing'],
  data() {
    return {
      sound: undefined,
      playing: false,
      progress: 0
    }
  },
  computed: {
    ...mapGetters(['mediaPlaying'])
  },
  watch: {
    mediaPlaying(nV) {
      if (nV) { this.pauseAudio() }
    }
  },
  beforeDestroy() {
    try {
      if (this.sound) {
        this.sound.unload()
      }
    } catch (error) {
      console.error(error);
    }
  },
  mounted() {
    // Create Howl instance
    this.sound = new Howl({
      src: this.intro.audio,
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
    playAudio() {
      if (this.playing)  return
      this.sound.play()
    },
    pauseAudio() {
      this.sound.pause()
    },
    rewindAudio() {
      this.sound.seek(0)
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

.snippet
  radius(10px)
  background-color $color-info
  cursor pointer
  float left
  height 100px
  margin 5px
  padding 10px
  position relative
  text-align center
  width 200px
  &.editing
    height 140px
  @media(max-width: 470px)
    height auto
    width calc(100% - 30px)
  p
    reset()
    color white
    font-weight bold
    line-height 20px
    max-height 40px
    max-width 100%
    margin-bottom 10px
    overflow hidden
  svg
    color white
    margin 15px 5px
    &.fa-step-forward, &.fa-step-backward
      opacity 0
      pointer-events none
    &:hover
      cursor pointer
  &.playing
    background-color $color-pink
    cursor default
    svg.fa-step-backward
      opacity 1.0
      pointer-events all

</style>
