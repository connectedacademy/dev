<template lang="pug">

#vis-container

  // Visualisation
  svg#visualisation(v-if="visualisation" v-bind:height="visHeight" width="100%" viewBox="0 0 646 60" preserveAspectRatio="none")
    defs
      filter(id="bandw")
        feColorMatrix(type="matrix" values="0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 1 0")

    clipPath(id="progress")
      rect(v-bind:x="`${playheadPos}%`" y="0" v-bind:width="`${100 - playheadPos}%`" height="100%" fill="black" filter="url(#bandw)")
    
    clipPath(id="mask")
      rect(v-for="(segment, index) in buffered" v-bind:key="index" v-bind:x="`${segment.start}%`" y="0" v-bind:width="`${segment.end}%`" height="60" fill="black")
    
    // Vis
    g(id="primaryVis")
      rect(v-for="(val, index) in visualisation" v-bind:key="index" v-if="(typeof val === 'number')" v-bind:x="`${index}%`" width="2px" rx="1" ry="1" v-bind:y="`${(100 - parseInt(val * 80)) / 2}%`" v-bind:height="`${parseInt(val * 80)}%`" v-bind:style="{ fill: '#1864ef' }")
    use(x="0" y="0" href="#primaryVis" clip-path="url(#progress)" filter="url(#bandw)")

    // Track
    g(id="primaryTrack")
      rect(x="0%" width="100%" v-bind:y="'29px'" v-bind:height="'2px'" v-bind:style="{ fill: '#1864ef' }")
    use(x="0" y="0" href="#primaryTrack" clip-path="url(#progress)" filter="url(#bandw)")

    // Buffer
    //- g(id="buffer")
      rect(x="0%" width="100%" y="39px" height="2px" v-bind:style="{ fill: 'orange' }" opacity="1.0")
      rect(clip-path="url(#mask)" x="0%" width="100%" y="38px" height="4px" v-bind:style="{ fill: 'white' }")

  // Animations
  svg#animations(v-if="visualisation" v-bind:height="visHeight" width="100%" viewBox="0 0 646 60" preserveAspectRatio="none")
    g(id="animations")
      circle(v-for="(animation, index) in animations" v-bind:key="animation.x"  v-bind:cx="`${animation.x}%`" cy="30px" r="5px" v-bind:style="{ fill: '#FF01A0' }")

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
      console.log('val')
      this.pushAnimation(val.segmentGroup)
    }
  },
  watch: {
    classSlug() {
      this.loadVisualisation()
    },
    contentSlug() {
      this.loadVisualisation()
    },
    contentDuration() {
      this.loadVisualisation()
    }
  },
  mounted() {
    this.loadVisualisation()

    EventBus.$on('scrollStatus', (scrollStatus) => {
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