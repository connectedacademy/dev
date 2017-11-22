<template lang="pug">
  
  .visualisation
    canvas(ref="canvas" width="588" height="50")

</template>

<script>
import { mapGetters } from 'vuex'

import Visualisation from '@/mixins/Visualisation'
import _each from 'lodash/each'

import { EventBus } from '@/event-bus.js'

export default {
  name: 'visualisation',
  props: ['currentClass'],
  mixins: [
    Visualisation,
  ],
  mounted() {
    this.loadVisualisation()

    EventBus.$on('messagePosted', (message) => {
      this.loadVisualisation()
    })

    EventBus.$on('scrollStatus', (scrollStatus) => {
      this.scrollStatus = scrollStatus
    })
  },
  watch: {
    scrollStatus(nV, oV) {
      if (typeof nV === 'undefined') { return }
      this.drawVis()
    },
    visualisation(nV, oV) {
      if (typeof nV === 'undefined') { return }
      this.drawVis()
    },
  },
  data() {
    return {
      theData: [],
      scrollStatus: undefined,
    }
  },
  methods: {
    drawVis() {

      if (!this.scrollStatus) return

      const visWidth = 588
      const visHeight = 50

      var canvas = this.$refs.canvas
      var context = canvas.getContext("2d")

      // Clear the canvas
      context.clearRect(0, 0, visWidth, visHeight)

      // Gradient background
      // var grd = context.createLinearGradient(0,0,170,0)
      // grd.addColorStop(0,"#DCD8DF")
      // grd.addColorStop(1,"#A08F90")

      // context.fillStyle = grd

      // context.fillRect(0, 0, visWidth, visHeight)

      const playheadPos = ((1 / this.content.duration) * this.scrollStatus.currentTime) * visWidth
      
      // Draw visualisation
      _each(this.visualisation, (value, position) => {
        let width = 2
        let fill = '#ddd'
        if (value < 0.02) {
          value = 0.04
          width = 2
          fill = '#ddd'
        }
        fill = (parseFloat(position) * visWidth < playheadPos) ? '#33B376' : fill
        context.beginPath()
        context.rect(parseFloat(position) * visWidth, ((1.0 - value) * (visHeight / 2)), width, (value * visHeight))
        // if (value > 0.04) {
        //   context.rect(parseFloat(position) * visWidth, 50, width, (value * 20))
        // }
        context.fillStyle = fill
        context.fill()
      })
      
      // Draw playhead
      // context.beginPath()
      // context.arc(playheadPos, 25, 5, 0, 2 * Math.PI, false)
      // context.fillStyle = '#33B376'
      // context.fill()
    }
  }
}
</script>

<style lang="stylus">

@import '~stylus/shared'

.visualisation
  margin 0
  pointer-events none
  canvas
    height 50px
    margin 5px 0
    width 100%
</style>