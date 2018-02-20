import Vue from 'vue'

import _clamp from 'lodash/clamp'
import _each from 'lodash/each'

export default {
  data() {
    return {
      visType: 'newform', // heatmap, waveform
      animPos: '0%',
      scrollStatus: undefined,
    }
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
  methods: {
    drawVis() {

      if (!this.scrollStatus) return

      const playheadSize = 6
      const drawTrack = true
      const drawTimeline = true
      const drawBuffering = true
      const drawPlayhead = true

      const trackHeight = 2

      let waveformWidth = 2
      const waveformOffset = 1

      const visWidth = 588
      const visHeight = 50

      const requestAnimationFrame = window.requestAnimationFrame

      var step = () => {

        var canvas = this.$refs.canvas
        var context = canvas.getContext("2d")

        var animationCanvas = this.$refs.animationcanvas
        var animationContext = animationCanvas.getContext("2d")

        // Clear the canvas
        context.clearRect(0, 0, visWidth, visHeight)
        animationContext.clearRect(0, 0, visWidth, visHeight)

        CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
          if (w < 2 * r) r = w / 2;
          if (h < 2 * r) r = h / 2;
          this.beginPath();
          this.moveTo(x + r, y);
          this.arcTo(x + w, y, x + w, y + h, r);
          this.arcTo(x + w, y + h, x, y + h, r);
          this.arcTo(x, y + h, x, y, r);
          this.arcTo(x, y, x + w, y, r);
          this.closePath();
          return this;
        }

        // Draw track
        if (drawTrack) {
          context.beginPath()
          context.roundRect(0, ((visHeight - trackHeight) / 2), visWidth, trackHeight, 3)
          context.fillStyle = '#f2f2f2'
          context.fill()
        }

        // Draw buffering status
        if (drawBuffering) {
          const relativeSize = (visWidth / this.content.duration)
          for (let index = 0; index < this.bufferedSegments.length; index++) {

            let start = relativeSize * this.bufferedSegments.start(index)
            let end = relativeSize * this.bufferedSegments.end(index)

            // Clamp
            start = _clamp(start, start, 0)
            end = _clamp(end, end, visWidth)

            context.beginPath()
            context.roundRect(start, ((visHeight - trackHeight) / 2), end, trackHeight, 3)
            context.fillStyle = '#d9d9d9'
            context.fill()
          }
        }

        // Set playhead position relative to vis width
        let playheadPos = ((1 / this.content.duration) * this.scrollStatus.currentTime) * visWidth

        // Ensure playhead does not run off the edges of track
        const end = (visWidth - (playheadSize * 2))
        playheadPos = _clamp(playheadPos, 0, end)

        // Draw timeline
        if (drawTimeline) {
          context.beginPath()
          context.roundRect(0, ((visHeight - trackHeight) / 2), playheadPos, trackHeight, (trackHeight / 2))
          context.fillStyle = '#33B376'
          context.fill()
        }

        // Draw visualisation
        _each(this.visualisation, (value, position) => {
          if (this.visType === 'waveform') {
            let fill = '#eaeaea'
            if (value < 0.1) {
              value = value + 0.1
              waveformWidth = 0
            }
            fill = (parseFloat(position) * visWidth < playheadPos) ? '#33B376' : fill
            context.beginPath()
            context.roundRect(parseFloat(position) * visWidth - 1.0, ((1.0 - value) * (visHeight / 2)), waveformWidth, (value * visHeight), 3)
            context.fillStyle = fill
            context.fill()
          }
          else if (this.visType === 'heatmap') {

            value = (value > 0.5) ? (value * 10) : (value * 50)
            context.beginPath()
            context.arc(parseFloat(position * visWidth), (visHeight / 2), value, 0, 2 * Math.PI, false)
            context.fillStyle = '#1864EF'
            context.fillStyle = 'rgba(1, 180, 116, 1)'
            context.fill()
          }
          else if (this.visType = 'newform') {
            let fill = '#d9d9d9'
            // value = (value < 0.2) ? (value + 0.2) : value
            fill = (parseFloat(position) * visWidth < playheadPos) ? '#33B376' : fill
            let pointHeight = value * ((visHeight / 2) - (trackHeight / 2) + waveformOffset)
            // var time = new Date()
            // pointHeight = pointHeight / (60 / time.getSeconds())

            context.beginPath()
            context.roundRect((parseFloat(position) * visWidth) + playheadSize, (visHeight / 2) - pointHeight, waveformWidth, pointHeight, 1.5)
            context.fillStyle = fill
            context.fill()

            context.beginPath()
            context.roundRect((parseFloat(position) * visWidth) + playheadSize, (visHeight / 2), waveformWidth, pointHeight, 1.5)
            context.fillStyle = fill
            context.fill()
          }
        })

        // Draw playhead
        if (drawPlayhead) {
          context.beginPath()
          context.arc((playheadPos + playheadSize), (visHeight / 2), playheadSize, 0, 2 * Math.PI, false)
          context.fillStyle = '#33B376'
          context.fill()
        }
      }

      requestAnimationFrame(step)
    }
  }
}
