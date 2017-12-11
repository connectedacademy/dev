<template lang="pug">
  
  .visualisation(v-if="content.duration")
    
    #vis-container(v-if="renderType === 'dom'")
      
      #vis(v-if="visualisation")
        .vis-point(v-for="(val, key) in visualisation" v-bind:key="key" v-bind:style="{ left: `${parseFloat(key) * 100}%`, height: `${parseFloat(val) * 50}px`, 'margin-top': (`${parseFloat(-val) * (50 / 2)}px`) }" v-bind:class="{ active: (parseInt(key * 100) < parseInt(playheadPos)) }")
      
      #track
      
      #progress(v-bind:style="{ width: `${playheadPos}%` }")

      //- #buffer
        .buffer-element(v-for="(segment, index) in buffered" v-bind:key="index" v-bind:style="{ left: `${segment.start}%`, right: `${100 - segment.end}%` }")
      
      //- #animation(v-bind:style="{ left: animPos }")
      
      #playhead(v-bind:style="{ left: `${playheadPos}%` }")
    
    #canvas-visualisation(v-if="renderType === 'canvas'")
      canvas(ref="canvas" width="588" height="50")
      canvas(ref="animationcanvas" width="588" height="50")

</template>

<script>
import { mapGetters } from 'vuex'

import Visualisation from '@/mixins/Visualisation'
// import CanvasVisualisation from '@/mixins/CanvasVisualisation'

import _clamp from 'lodash/clamp'
import _each from 'lodash/each'
import _round from 'lodash/round'

import { EventBus } from '@/event-bus.js'

export default {
  name: 'visualisation',
  props: ['currentClass', 'bufferedSegments', 'content'],
  mixins: [
    Visualisation
    // CanvasVisualisation
  ],
  mounted() {
    this.loadVisualisation()

    EventBus.$on('messagePosted', (message) => {
      // TODO: Reload vis
      // this.loadVisualisation()
    })

    EventBus.$on('scrollStatus', (scrollStatus) => {
      this.scrollStatus = scrollStatus
    })

    EventBus.$on('socketConversationMessage', (obj) => {
      
      const animPos = (100 / parseInt(this.content.duration)) * obj.msg.segment
      this.animPos = `${animPos}%`
    })
  },
  data() {
    return {
      renderType: 'dom', // canvas
      animPos: '0%',
      theData: [],
      scrollStatus: undefined,
    }
  },
  computed: {
    buffered() {
      let buffered = []
      
      if (typeof this.bufferedSegments === 'undefined') return buffered

      for (let index = 0; index < this.bufferedSegments.length; index++) {
        const element = {
          start: _clamp(this.bufferedSegments.start(index) * (100 / this.content.duration), 0, 100),
          end: _clamp(this.bufferedSegments.end(index) * (100 / this.content.duration), 0, 100)
        }
        buffered.push(element)
      }
      return buffered
    },
    playheadPos() {
      // If no scrollStatus assume start
      if (typeof this.scrollStatus === 'undefined') {
        return 0
      }

      // Set playhead position relative to vis width
      let playheadPos = ((100 / parseInt(this.content.duration)) * this.scrollStatus.currentTime)
      return playheadPos
    }
  }
}
</script>

<style lang="stylus">

@import '~stylus/shared'

$color-v = transparent // $color-lightest-grey
$color-v-track = lighten($color-lighter-grey, 40%)
$color-v-playhead = darken($color-primary, 10%)
$color-v-point = $color-lighter-grey
$color-v-point-active = $color-primary
$color-v-progress = $color-primary

$v-height = 60px
$v-track-height = 4px
$v-point-width = 3px
$v-playhead-size = 12px

.visualisation
  margin 0
  pointer-events none
  canvas
    pinned()
    height 50px
    margin 5px 0
    width 100%
    position absolute

  #vis-container
    pinned()    
    background-color $color-v
    // padding 0 5px
    position absolute
    width 100%
    #track
      radius($v-track-height / 2)
      background-color $color-v-track
      height $v-track-height
      margin-top ( ( $v-height - $v-track-height ) / 2 )
      width 100%
    #progress
      radius($v-track-height / 2)
      background-color $color-v-progress
      height $v-track-height
      position absolute
      top ( $v-height / 2 ) - ( $v-track-height / 2 )
      left 0
    #buffer
      pinned()
      position absolute
      .buffer-element
        background-color alpha(black, 0.2)
        height $v-track-height
        position absolute
        top ( $v-height / 2 ) - ( $v-track-height / 2 )
    #playhead
      radius(50%)
      background-color $color-v-playhead
      border white 2px solid
      cursor pointer
      height $v-playhead-size
      margin-left -($v-playhead-size / 2)
      top ( $v-height / 2 ) - ( $v-playhead-size / 2 ) - 2
      position absolute
      width $v-playhead-size
      pointer-events all
    #animation
      radius(50%)
      box-sizing()
      border $color-info 3px solid
      height 20px
      width 20px
      margin-left -(20px / 2)
      top ( $v-height / 2 ) - ( 20px / 2 )
      position absolute
      pointer-events all
      z-index 2
      &:hover
        transform scale(1.5)
    #vis
      pinned()
      position absolute
      .vis-point
        pinned()
        radius($v-point-width / 2)
        position absolute
        top 50%
        right auto
        background-color $color-v-point
        width $v-point-width
        &.active
          background-color $color-v-point-active
</style>