<template lang="pug">

#vis-container

  // Visualisation
  svg(v-if="visualisation" v-bind:height="visHeight" width="100%" viewBox="0 0 600 60" preserveAspectRatio="none")
    defs
      filter(id="bandw")
        feColorMatrix(type="matrix" values="0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 1 0")

    clipPath(id="progress")
      rect(v-bind:x="`${playheadPos}%`" y="0" v-bind:width="`${100 - playheadPos}%`" height="100%" fill="black" filter="url(#bandw)")
    
    clipPath(id="mask")
      rect(v-for="(segment, index) in buffered" v-bind:key="index" v-bind:x="`${segment.start}%`" y="0" v-bind:width="`${segment.end}%`" height="60" fill="black")
    
    // Vis
    g(id="vis")
      g(id="primaryVis")
        rect(v-for="(val, index) in visualisation" v-bind:key="index" v-if="(typeof val === 'number')" v-bind:x="`${index}%`" width="2px" v-bind:y="`${(100 - parseInt(val * 180)) / 2}%`" v-bind:height="`${parseInt(val * 180)}%`" v-bind:style="{ fill: classView ? '#1864ef' : 'white' }")
      use(v-if="classView" x="0" y="0" href="#primaryVis" clip-path="url(#progress)" filter="url(#bandw)")

    // Track
    g(id="track")
      g(id="primaryTrack")
        rect(x="0%" width="100%" v-bind:y="classView ? '29px' : '49%'" v-bind:height="classView ? '2px' : '2%'" v-bind:style="{ fill: classView ? '#1864ef' : 'white' }")
      use(x="0" y="0" href="#primaryTrack" clip-path="url(#progress)" filter="url(#bandw)")

    // Buffer
    g.hidden(v-if="classView" id="buffer")
      rect(x="0%" width="100%" y="39px" height="2px" v-bind:style="{ fill: 'orange' }" opacity="1.0")
      rect(clip-path="url(#mask)" x="0%" width="100%" y="38px" height="4px" v-bind:style="{ fill: 'white' }")

  // Animations
  svg#animations(v-if="visualisation" v-bind:height="visHeight" width="100%" viewBox="0 0 600 60")
    g(id="animations")
      circle(v-for="(animation, index) in animations" v-bind:key="animation.x"  v-bind:cx="`${parseInt(animation.x * 100)}%`" cy="30px" r="5px" v-bind:style="{ fill: '#FF01A0' }")

</template>

<script>
import { mapGetters } from 'vuex'
import { TweenLite } from 'gsap'
import { EventBus } from '@/event-bus.js'

import Visualisation from '@/mixins/Visualisation'

import _clamp from 'lodash/clamp'
import _find from 'lodash/find'

export default {
  name: 'visualisation',
  props: ['bufferedSegments', 'classSlug', 'contentSlug', 'contentDuration', 'showReflections', 'classView', 'visHeight'],
  mixins: [
    Visualisation
  ],
  watch: {
    classSlug() {
      this.loadVisualisation(true)
    },
    contentSlug() {
      this.loadVisualisation(true)
    },
    contentDuration() {
      this.loadVisualisation(true)
    }
  },
  mounted() {
    // Fake activity
    setInterval(() => {
      this.pushAnimation(Math.floor(Math.random() * 1000))
    }, 1000)

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
            this.pushAnimation(element.msg.segment)
          }
        }
      }
    })
  },
  data() {
    return {
      scrollStatus: undefined
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
  },
  methods: {
    pushAnimation (segment) {
      const segmentSize = 5
      const pos = ((segment * segmentSize) / this.contentDuration)
      const animation = { x: pos }

      // If animation exists return
      if (_find(this.animations, { x: pos })) return console.log('Exists!')
      
      // Put new animation at start of array
      this.animations.unshift(animation)
      
      // Limit number of animations
      if (this.animations.length > 10) this.animations.pop()
    }
  }
}
</script>

<style lang="stylus">

@import '~stylus/shared'

#vis-container
  margin 0
  pointer-events none
  position relative
  svg
    pinned()    
    position absolute

  #animations
    circle
      animation fade-out 3s linear
      opacity 0
      pointer-events none

.slide-fade-enter-active
  transition all .5s ease

.slide-fade-leave-active
  transition all .5s cubic-bezier(1.0, 0.8, 0.8, 1.0)

.slide-fade-enter, .slide-fade-leave-to
  transform translateY(100px)
  opacity 0

@keyframes fade-out {
  0% { opacity: 0 }
  30% { opacity: 1 }
  100% { opacity: 0 }
}
</style>