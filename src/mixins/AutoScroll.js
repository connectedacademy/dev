import Vue from 'vue'
import app from '@/config'
import { mapGetters } from 'vuex'
import { Events } from '@/events.js'

import _get from 'lodash/get'
import _round from 'lodash/round'
import _throttle from 'lodash/throttle'

const AUTO_SCROLL_ATTEMPT = 1500 // Interval at which to attempt auto scroll
const WHEEL_TIMEOUT = 1000 // Interval before assumed no longer manually scrolling
const SCROLL_UPDATE_INTERVAL = 200 // Interval at which scroll position should be updated

export default {
  mounted() {
    setTimeout(() => {
      // Attempt auto scroll every second
      this.intervals.attemptAutoScroll = setInterval(() => { this.attemptAutoScroll() }, AUTO_SCROLL_ATTEMPT)

      // Listen for scroll events
      this.onScroll(this)
      window.addEventListener('scroll', () => {
        // Scroll update
        this.onScroll(this)
      }, { passive: true })

      // Listen for wheel events
      window.addEventListener('wheel', this.onWheel, { passive: true }) // Passive to improve mobile performance

      // Listen for mousedown events
      window.addEventListener('mousedown', this.onMousedown, { passive: true }) // Passive to improve mobile performance
      window.addEventListener('touchstart', this.onWheel, { passive: true }) // Passive to improve mobile performance

      // Listen for mouseup events
      window.addEventListener('mouseup', this.onMouseup, { passive: true }) // Passive to improve mobile performance
      // window.addEventListener('touchend', this.onMouseup, { passive: true }) // Passive to improve mobile performance
    }, 2000)

    Events.$on('setPlaybackSpeed', (speed) => {
      this.durationRate = 5000 / speed
    })
  },
  beforeDestroy() {
    // Clear intervals
    clearInterval(this.intervals.attemptAutoScroll)
    
    // Remove event listeners
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('wheel', this.onWheel)
    window.removeEventListener('mousedown', this.onMousedown)
    window.removeEventListener('mouseup', this.onMouseup)
    window.removeEventListener('touchstart', this.onWheel)
    // window.removeEventListener('touchend', this.onMouseup)
  },
  data() {
    return {
      durationRate: 5000,
      end: undefined,
      scrollStatus: undefined,
      wheeling: false,
      isAutoScrolling: false,
      preventScroll: false,
      intervals: {
        attemptAutoScroll: undefined
      }
    }
  },
  watch: {
    mediaPlaying(nV) {
      if (nV) { this.attemptAutoScroll() }
    }
  },
  computed: {
    ...mapGetters([
      'mediaPlaying', 'activeSegment', 'peekSegment', 'mediaHidden', 'isEditing'
    ]),
    canAutoScroll() {
      return !this.peekSegment && !this.preventScroll && this.mediaPlaying && (typeof this.scrollStatus !== 'undefined')
    }
  },
  methods: {
    attemptAutoScroll() {

      Vue.$log.debug('Attempting auto scroll')

      if (this.isEditing) { Vue.$log.debug('Cannot auto scroll - editing transcript'); return }
      if (!this.canAutoScroll) { Vue.$log.debug('Cannot auto scroll'); this.isAutoScrolling = false; this.onScroll(this); return }
      if (this.isAutoScrolling) { Vue.$log.debug('Already auto scrolling'); return }

      this.isAutoScrolling = true

      const end = this.getEnd()

      let position = function(start, end, elapsed, duration) {
        return start + (end - start) * (elapsed / duration) // Linear
      }

      const clock = Date.now()
      const requestAnimationFrame = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function(fn) { window.setTimeout(fn, 15) }

      const start = _get(this.scrollStatus, 'scrollPos', 0)

      var duration = (((end - start) / (this.$app.segmentHeight * 1.0)) * this.durationRate)

      var step = () => {

        var elapsed = Date.now() - clock

        const yPos = position(start, end, elapsed, duration)

        if (!this.preventScroll) {
          window.scroll(0, yPos)
        }

        if ((elapsed <= duration) && this.canAutoScroll) {
          requestAnimationFrame(step)
        }
        else if (elapsed > duration) {
          Vue.$log.info('(elapsed > duration) -- Pausing')
          this.$store.commit('PAUSE_MEDIA')
        }
      }
      step()
    },
    wheelMovement() {

      if (this.peekSegment || this.preventScroll) {
        return
      }
      if (this.mediaPlaying) {
        this.$store.commit('PAUSE_MEDIA')
      }
      this.preventScroll = true
      this.isAutoScrolling = false

      clearTimeout(this.wheeling)

      this.wheeling = setTimeout(() => {
        this.wheeling = undefined
        this.preventScroll = false
      }, WHEEL_TIMEOUT)
    },
    onWheel() {
      if (!this.activeSegment) {
        this.wheelMovement(this)
      }
    },
    onMousedown() {
      Vue.$log.debug('MOUSEDOWN')
      this.preventScroll = true
      this.isAutoScrolling = false
    },
    onMouseup() {
      Vue.$log.debug('MOUSEUP')
      this.preventScroll = false
      this.isAutoScrolling = false
    },
    getEnd() {
      const element = document.getElementById('conversation-container');
      if (!element) return 0
      return element.offsetTop + element.offsetHeight
    },
    onScroll: _throttle(function (self) {

      // Calculate
      let scrollPos = window.scrollY

      // Get conversation container element
      const element = document.getElementById('conversation-container')

      // Ig no element then return
      if (!element) return

      // Offset
      const bottomPadding = 280
      const actionPanelHeight = self.mediaHidden ? 60 : 260
      const pageOffset = document.documentElement.scrollHeight - element.offsetHeight - bottomPadding
      const offset = actionPanelHeight + pageOffset // element.offsetTop
      

      const offsetScrollPos = scrollPos + window.innerHeight - offset
      
      this.end = this.getEnd()

      // Time
      const currentTime = _round(offsetScrollPos / (app.segmentHeight * 0.2))

      // Segment group
      let currentSegmentGroup = Math.floor(currentTime * 0.2)

      // Create object
      const scrollStatus = {
        scrollPos,
        offsetScrollPos,
        currentTime,
        currentSegmentGroup
      }

      // Update scrollStatus
      self.scrollStatus = scrollStatus
      Events.$emit('scrollStatus', scrollStatus)

    }, SCROLL_UPDATE_INTERVAL, { 'leading': false, 'trailing': true })
  }
}
