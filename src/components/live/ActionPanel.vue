<template lang="pug">

  #action-panel(name="action-panel" v-bind:class="{ 'hide-media': mediaHidden }" ref="actionpanel")

    ul#experience-controls
    
      li.experience-control(name="play-pause-button" @click="toggleMediaPlayback")
        onboarding-prompt(identifier="play-pause-toggle" prompt="play/pause" top="-45" left="10" position="bottom-left" z-index="1")
        icon(:icon="mediaPlaying ? 'pause' : 'play'")
      
      li.experience-control#current-time
        p {{ currentTime }}
      
      li.experience-control#progress-bar(ref="progressbar" :class="{ 'has-media': mediaLoaded }" @mousedown="startScrub" @mouseup="endScrub" @mousecancel="endScrub")
        //- @mousemove="scrubMove"
        visualisation(v-bind:bufferedSegments="bufferedSegments" v-bind:contentSlug="content.slug" v-bind:classSlug="currentClass.slug" v-bind:contentDuration="content.duration" v-bind:showReflections="false" v-bind:classView="true" visHeight="60px")
      
      transition(name="fade" appear mode="out-in")
        li.experience-control.pull-right(v-if="mediaLoaded" @click="toggleComposer")
          onboarding-prompt(identifier="media-toggle" prompt="toggle media" top="-45" left="-132" position="bottom-right" z-index="1")
          icon(:icon="mediaHidden ? 'caret-up' : 'caret-down'")

      .clearfix

    media-container#media-container(v-show="mediaLoaded" v-bind:content="content" v-bind:current-class="currentClass")

</template>

<script>
  import { Events } from '@/events.js'
  import { mapGetters } from 'vuex'
  import Moment from 'moment-mini'
  
  import MessageComposer from '@/components/MessageComposer'
  import MediaContainer from '@/components/MediaContainer'
  import Visualisation from '@/components/live/Visualisation'

  import _round from 'lodash/round'

  import MediaStream from '@/mixins/MediaStream'
  
  export default {
    name: 'action-panel',
    props: ['currentClass', 'content'],
    components: {
      MessageComposer,
      MediaContainer,
      Visualisation
    },
    mixins: [
      MediaStream
    ],
    mounted() {
      Events.$on('scrollStatus', (scrollStatus) => {
        if (scrollStatus.currentTime <= 0) {
          this.currentTime = '0:00'
        } else {
          let time = _round(scrollStatus.currentTime)
          this.currentTime = `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`
        }
      })
      Events.$on('mediaLoaded', () => {
        this.mediaLoaded = true
      })
    },
    data() {
      return {
        mediaLoaded: false,
        currentTime: '0:00',
        mouseOffsetStart: 0,
        trackOffset: 0
      }
    },
    computed: {
      ...mapGetters(['mediaHidden', 'mediaPlaying'])
    },
    methods: {
      scrollToPos() {
        const offset = -24
        const newPos = ((this.trackOffset / this.$refs.progressbar.offsetWidth) * this.content.duration) + offset
        const segmentSize = 5
        window.scroll(0, ((newPos / segmentSize) * 158.0))

        setTimeout(() => { this.trackOffset = 0 }, 500)
      },
      scrubMove(event) {
        if (this.mouseOffsetStart === 0 || event.clientY < this.$refs.actionpanel.offsetTop) return
        this.trackOffset = (event.pageX - this.$refs.actionpanel.offsetLeft - this.$refs.progressbar.offsetLeft)
        this.scrollToPos()
      },
      startScrub(event) {
        this.$store.commit('EXPAND_CONVERSATION')
        this.$store.commit('PAUSE_MEDIA')
        this.trackOffset = 0
        this.mouseOffsetStart = event.pageX
      },
      endScrub(event) {
        this.mouseOffsetStart = 0
        this.trackOffset = (event.pageX - this.$refs.actionpanel.offsetLeft - this.$refs.progressbar.offsetLeft)
        
        this.scrollToPos()
        setTimeout(() => { this.$store.commit('PLAY_MEDIA') }, 1000)
      },
      toggleComposer() {
        this.$store.commit(this.mediaHidden ? 'SHOW_MEDIA' : 'HIDE_MEDIA')
      },
      toggleMediaPlayback() {
        // Toggle playback
        this.$store.commit(this.mediaPlaying ? 'PAUSE_MEDIA' : 'PLAY_MEDIA')

        // Expand conversation
        if (!this.mediaPlaying) { this.$store.commit('EXPAND_CONVERSATION') }
      }
    }
  }
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

#action-panel
  animate()
  pinned()
  radius-top($corner-radius)
  box-shadow-dark()
  background white
  top auto
  height ($media-height + $controls-height)
  z-index 50
  position fixed
  width $col-width + 20px
  left 50%
  margin-left -400px
  #media-container
    transition(opacity 0.1s ease-out)
    opacity 1
  &.full-width
    width 100%
    left 0
    margin-left 0
  &.hide-media
    bottom -($media-height)
    #media-container
      opacity 0
  &.hide
    bottom -($media-height + 200px)

  @media(max-width: 800px)
    radius(0)
    margin-left 0
    left 0
    width 100%

  ul#experience-controls
    cleanlist()
    box-sizing()
    height $controls-height
    padding 0
    position relative
    z-index 1
    max-width $col-width
    margin 0 auto
    @media(max-width: 780px)
      padding 0 10px

    li.experience-control
      cleanlist()
      animate()
      float left
      position relative
      text-align center
      &.pull-right
        float right
        border none
      p
        reset()
        font-size 0.8em
        font-weight bold
        line-height $controls-height
      svg
        animate()
        color $color-text-dark-grey
        display block
        height 18px
        width 18px
        margin (($controls-height - 18px) / 2) 10px
      &:hover
        cursor pointer
        &.unclickable
          cursor default

    li#current-time
      padding 0 5px

    li#progress-bar
      pinned()
      margin 0
      position absolute
      left (38px * 2) + 10px
      right (38px * 0) + 10px
      @media(max-width: 780px)
        left (38px * 2) + 20px
      &.has-media
        right (38px * 1) + 10px

</style>
