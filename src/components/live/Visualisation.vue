<template lang="pug">

#vis-container
    
  // Vis
  g(id="primaryVis")
    rect(v-for="(val, index) in visualisation" :key="index" v-if="(typeof val === 'number')" :x="`${(index > 99) ? 99 : index}%`" width="6px" rx="3px" ry="3px" :y="`${(100 - parseInt(val * 80)) / 2}%`" :height="`${parseInt(val * 80)}%`" :style="{ fill: '#1864ef' }")

  // Track
  g(id="primaryTrack")
    rect(x="0%" width="100%" :y="'27px'" height="6px" rx="3px" ry="3px" :style="{ fill: '#1864ef' }")

  // Visualisation
  svg#visualisation(v-if="visualisation" :height="visHeight" width="100%" viewBox="0 0 646 60" preserveAspectRatio="none")
    defs
      filter(id="bandw")
        feColorMatrix(type="matrix" values="0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 1 0")

    clipPath(id="progress")
      rect(:x="`0%`" y="0" :width="`${playheadPos}%`" height="100%" fill="black" filter="url(#bandw)")
    
    //- clipPath(id="mask")
      rect(v-for="(segment, index) in buffered" :key="index" :x="`${segment.start}%`" y="0" :width="`${segment.end}%`" height="60" fill="black")

    //- // Buffer
      g(id="buffer")
        rect(x="0%" width="100%" y="39px" height="2px" :style="{ fill: 'orange' }" opacity="1.0")
        rect(clip-path="url(#mask)" x="0%" width="100%" y="38px" height="4px" :style="{ fill: 'white' }")

    use(xlink:href="#primaryTrack" style="opacity: 0.2")
    use(xlink:href="#primaryTrack" clip-path="url(#progress)")
    
    use(xlink:href="#primaryVis" style="opacity: 0.2")
    use(xlink:href="#primaryVis" clip-path="url(#progress)")
  // Animations
  svg#animations(v-if="visualisation" :height="visHeight" width="100%" viewBox="0 0 646 60" preserveAspectRatio="none")
    g(id="animations")
      circle(v-for="(animation, index) in animations" :key="animation.x"  :cx="`${animation.x}%`" cy="30px" r="5px" :style="{ fill: '#FF01A0' }")

</template>

<script>
import { mapGetters } from 'vuex'
import { TweenLite } from 'gsap'
import { Events } from '@/events.js'

import Visualisation from '@/mixins/Visualisation'

import _clamp from 'lodash/clamp'
import _find from 'lodash/find'

export default {
  name: 'visualisation',
  props: ['bufferedSegments', 'classSlug', 'contentSlug', 'contentDuration', 'showReflections', 'visHeight'],
  mixins: [
    Visualisation
  ],
  sockets: {
    visualisation: function (val) {
      console.log('SOCKET: visualisation updating..')
      this.loadVisualisation()
    },
    message: function (val) {
      console.log('SOCKET: animation updating..')
      this.pushAnimation(val.segmentGroup)
    }
  },
  watch: {
    classSlug() {
      this.loadVisualisation()
    }
  },
  mounted() {
    this.loadVisualisation()

    Events.$on('scrollStatus', (scrollStatus) => {
      this.scrollStatus = scrollStatus
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
      const pos = parseInt((100 / parseInt(this.contentDuration)) * this.scrollStatus.currentTime)
      return pos ? pos : 0
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
  svg#visualisation
    rect
      transform translateX(-2px)
  svg#animations
    circle
      animation fade-out 4s ease
      opacity 0
      pointer-events none
      transform translateX(-1px)

.slide-fade-enter-active
  transition all 0.3s ease

.slide-fade-leave-active
  transition all 0.3s cubic-bezier(1.0, 0.8, 0.8, 1.0)

.slide-fade-enter, .slide-fade-leave-to
  transform translateY(100px)
  opacity 0

@keyframes fade-out {
  0% { opacity: 0; r: 0px; }
  30% { opacity: 1; }
  100% { opacity: 0; r: 8px; }
}
</style>