<template lang="pug">
  
  .visualisation

    // SVG
    #vis-container(v-if="renderType === 'svg'")
    
      svg(v-if="visualisation" v-bind:height="visHeight" width="100%" viewBox="0 0 600 80" preserveAspectRatio="none")
        defs
          filter(id="bandw")
            feColorMatrix(type="matrix" values="0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 1 0")

        clipPath(id="progress")
          rect(v-bind:x="`${playheadPos}%`" y="0" v-bind:width="`${100 - playheadPos}%`" height="100%" fill="black" opacity="1.0" filter="url(#bandw)")
        
        clipPath(id="Mask")
          rect(v-for="(segment, index) in buffered" v-bind:key="index" v-bind:x="`${segment.start}%`" y="0" v-bind:width="`${segment.end}%`" height="80" fill="grey" opacity="1.0")
        
        // Vis
        g(id="vis")
          g(id="primaryVis")
            //- rect(v-for="(val, index) in visualisation" v-bind:key="index" v-if="(typeof val === 'number')" v-bind:x="`${index}%`" width="0.5%" v-bind:y="`${classView ? (80 - parseInt(val * 80)) : ((100 - parseInt(val * 100)) / 2)}%`" v-bind:height="`${classView ? parseInt(val * 80) : parseInt(val * 100)}%`" v-bind:style="{ fill: classView ? '#29b474' : 'white' }")
            rect(v-for="(val, index) in visualisation" v-bind:key="index" v-if="(typeof val === 'number')" v-bind:x="`${index}%`" width="0.5%" v-bind:y="`${(100 - parseInt(val * 100)) / 2}%`" v-bind:height="`${parseInt(val * 100)}%`" v-bind:style="{ fill: classView ? '#29b474' : 'white' }")
          use(v-if="classView" x="0" y="0" href="#primaryVis" clip-path="url(#progress)" filter="url(#bandw)")

          //- g(id="reflectionVis" v-if="showReflections")
            use(x="0" y="0" href="#primaryVis" filter="url(#bandw)" transform="scale(1, -0.3) translate(0, -400%)")
            //- scale(1, -1) translate(0, -100)

        // Track
        //- g(v-if="classView" id="track")
          g(id="primaryTrack")
            rect(x="0%" width="100%" y="90%" height="5%" v-bind:style="{ fill: classView ? '#29b474' : 'white' }")
          use(v-if="classView" x="0" y="0" href="#primaryTrack" clip-path="url(#progress)" filter="url(#bandw)")

        // Buffer
        g(v-if="classView" id="buffer")
          rect(x="0%" width="100%" y="90%" height="4%" v-bind:style="{ fill: 'orange' }" opacity="1.0")
          rect(clip-path="url(#Mask)" x="0%" width="100%" y="88%" height="8%" v-bind:style="{ fill: 'white' }")

      svg(v-if="visualisation" v-bind:height="visHeight" width="100%" viewBox="0 0 600 80" preserveAspectRatio="xMinYMax slice")

        // Animations
        g(id="animations")
          //- rect(v-for="(animation, index) in animations" v-bind:key="animation.pos"  v-bind:x="`${parseInt(animation.pos * 100)}%`" v-bind:y="classView ? '85%' : '48%'" width="0.5%" height="4%" v-bind:style="{ fill: 'red' }")
          circle(v-for="(animation, index) in animations" v-bind:key="animation.pos"  v-bind:cx="`${parseInt(animation.pos * 100)}%`" cy="50%" v-bind:r="`${(classView) ? 0.5 : 0.25}%`" v-bind:style="{ fill: 'red' }")
          
    // DOM
    #vis-container(v-if="renderType === 'dom'")

      #vis(v-if="visualisation")
        .vis-point(v-for="(val, key) in visualisation" v-bind:key="key" v-bind:style="{ left: `${parseFloat(key) * 100}%`, height: `${parseFloat(val) * 50}px`, 'margin-top': (`${parseFloat(-val) * (50 / 2)}px`) }")
      
      #vis.clipped(v-if="visualisation" v-bind:style="{ '-webkit-clip-path': `polygon(0% 0%, ${playheadPos}% 0%, ${playheadPos}% 100%, 0% 100%)`, 'clip-path': `polygon(0% 0%, ${playheadPos}% 0%, ${playheadPos}% 100%, 0% 100%)` }")
        #progress
        .vis-point.active(v-for="(val, key) in visualisation" v-bind:key="key" v-bind:style="{ left: `${parseFloat(key) * 100}%`, height: `${parseFloat(val) * 50}px`, 'margin-top': (`${parseFloat(-val) * (50 / 2)}px`) }")
      
      #track

      #buffer
        .buffer-element(v-for="(segment, index) in buffered" v-bind:key="index" v-bind:style="{ left: `${segment.start}%`, right: `${100 - segment.end}%` }")
    
    // CANVAS
    #canvas-visualisation(v-if="renderType === 'canvas'")
      canvas(ref="canvas" width="588" height="50")
      canvas(ref="animationcanvas" width="588" height="50")

</template>

<script>
import { mapGetters } from 'vuex'

import Visualisation from '@/mixins/Visualisation'
// import CanvasVisualisation from '@/mixins/CanvasVisualisation'

import _ from 'lodash'
import _clamp from 'lodash/clamp'
import _each from 'lodash/each'
import _round from 'lodash/round'
import _throttle from 'lodash/throttle'
import _values from 'lodash/values'

import { EventBus } from '@/event-bus.js'

export default {
  name: 'visualisation',
  props: ['bufferedSegments', 'classSlug', 'contentSlug', 'contentDuration', 'showReflections', 'classView', 'visHeight'],
  mixins: [
    Visualisation
    // ,CanvasVisualisation
  ],
  watch: {
    classSlug() {
      this.loadVisualisation(true)
      this.animations = []
    },
    contentSlug() {
      this.loadVisualisation(true)
      this.animations = []
    },
    contentDuration() {
      this.loadVisualisation(true)
      this.animations = []
    }
  },
  mounted() {

    // Load visualisation with socket connection
    this.loadVisualisation(true)

    EventBus.$on('scrollStatus', (scrollStatus) => {
      this.scrollStatus = scrollStatus
    })

    EventBus.$on('socketVisupdate', (obj) => {

      let i = 0
      for (const o in obj) {
        if (obj.hasOwnProperty(o)) {
          i = i + 1
          const element = obj[o]
          if (element.msgtype === 'visupdate') {
            const segmentSize = 5
            setTimeout(() => {
              const animation = { pos: ((element.msg.segment * segmentSize) / this.contentDuration) }
              // Put new animation at start of array
              this.animations.unshift(animation)
              // Limit number of animations
              if (this.animations.length > 1) this.animations.pop()
              // Load visualisation without socket connection
              this.loadVisualisation(false)
            }, (i * 200))
          }
        }
      }
    })
  },
  data() {
    return {
      renderType: 'svg', // canvas dom svg
      scrollStatus: undefined,
      animations: []
    }
  },
  computed: {
    buffered() {
      let buffered = []
      
      if (typeof this.bufferedSegments === 'undefined') return buffered

      for (let index = 0; index < this.bufferedSegments.length; index++) {
        const element = {
          start: _clamp(this.bufferedSegments.start(index) * (100 / this.contentDuration), 0, 100),
          end: _clamp(this.bufferedSegments.end(index) * (100 / this.contentDuration), 0, 100)
        }
        buffered.push(element)
      }
      return buffered
    },
    playheadPos() {
      // If no scrollStatus assume start
      if (typeof this.scrollStatus === 'undefined') return 0

      // Set playhead position relative to vis width
      return parseInt((100 / parseInt(this.contentDuration)) * this.scrollStatus.currentTime)
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

$v-height = 80px
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
    position relative
    svg
      pinned()    
      position absolute

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
      right 0
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
      &.mirror
        pinned()
        clip-path polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)
        -webkit-clip-path polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)
        bottom 20px
        .vis-point
          // display none
          filter grayscale(100%)
          background-color red

.slide-fade-enter-active {
  transition: all .5s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.8, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  // transform: scale(0);
  transform: scale(0) translateY(100px);
  opacity: 0;
}
</style>