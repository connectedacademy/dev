import Vue from 'vue'
import app from '@/config'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

import _throttle from 'lodash/throttle'
import _find from 'lodash/find'
import _clamp from 'lodash/clamp'
import _round from 'lodash/round'

const AUTOSCROLL_ATTEMPT = 1500 // Interval at which to attempt auto scroll
const WHEEL_TIMEOUT = 1000 // Interval before assumed no longer manually scrolling
const SCROLL_UPDATE_INTERVAL = 200 // Interval at which scroll position should be updated

export default {
  mounted() {
    setTimeout(() => {
      // Attempt auto scroll every second
      this.intervals.attemptAutoScroll = setInterval(() => { this.attemptAutoScroll() }, AUTOSCROLL_ATTEMPT)

      // Listen for scroll events
      this.onScroll(this)
      window.addEventListener('scroll', () => {
        // Scroll update
        this.onScroll(this)
      }, { passive: true })

      // Listen for wheel events
      window.addEventListener('wheel', this.onWheel, { passive: true }) // Passive to improve mobile performance

      // Listen for mousedown events
      // window.addEventListener('mousedown', this.onMousedown, { passive: true }) // Passive to improve mobile performance
      // window.addEventListener('touchstart', this.onMousedown, { passive: true }) // Passive to improve mobile performance

      // Listen for mouseup events
      // window.addEventListener('mouseup', this.onMouseup, { passive: true }) // Passive to improve mobile performance
      // window.addEventListener('touchend', this.onMouseup, { passive: true }) // Passive to improve mobile performance
    }, 100)
  },
  beforeDestroy() {
    // Clear intervals
    clearInterval(this.intervals.attemptAutoScroll)
    
    // Remove event listeners
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('wheel', this.onWheel)
    // window.removeEventListener('mousedown', this.onMousedown)
    // window.removeEventListener('mouseup', this.onMouseup)
  },
  data() {
    return {
      scrollStatus: undefined,
      currentSection: undefined,
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
    },
    currentSection(nV, oV) {
      if (typeof nV === 'undefined') {
        this.$store.commit('PAUSE_MEDIA')
      }
    }
  },
  computed: {
    ...mapGetters([
      'mediaPlaying', 'activeSegment', 'peekSegment', 'scrollPoints',
    ]),
    canAutoScroll() {
      return (!this.peekSegment && !this.preventScroll && this.mediaPlaying && (typeof this.scrollStatus !== 'undefined') && (typeof this.currentSection !== 'undefined'))
    }
  },
  methods: {
    attemptAutoScroll() {

      Vue.$log.debug('Attempting auto scroll')

      if (!this.canAutoScroll) { Vue.$log.debug('Cannot auto scroll'); this.isAutoScrolling = false; this.onScroll(this); return }
      if (this.isAutoScrolling) { Vue.$log.debug('Already auto scrolling'); return }

      this.isAutoScrolling = true

      let position = function(start, end, elapsed, duration) {
        return start + (end - start) * (elapsed / duration) // Linear
      }

      const clock = Date.now()
      const requestAnimationFrame = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function(fn) { window.setTimeout(fn, 15) }

      var start = (this.scrollStatus && this.scrollStatus.scrollPos) ? this.scrollStatus.scrollPos : 0
      const durationRate = 5000
      let end = this.currentSection.bottom

      var duration = (((end - start) / (this.$app.segmentHeight * 1.0)) * durationRate)

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
    onScroll: _throttle(function (self) {

      // Calculate
      let scrollPos = window.scrollY

      // Offset
      let offsetScrollPos = scrollPos + window.innerHeight

      // Get class
      const scrollPoint = _find(self.scrollPoints, { content_type: 'class' })
      
      if (!scrollPoint) return

      // Check if current
      let newCurrentSection = undefined
      if ((offsetScrollPos > scrollPoint.top) && (offsetScrollPos < scrollPoint.bottom)) {
        offsetScrollPos = offsetScrollPos - scrollPoint.top
        newCurrentSection = scrollPoint
      }
      
      let scrollStatus = undefined

      if (self.currentSection != newCurrentSection) {
        self.$store.commit('SET_CURRENT_SECTION', newCurrentSection)
      }

      if (typeof newCurrentSection !== 'undefined') {
        
        // TODO
        // offsetScrollPos = offsetScrollPos - _clamp(((offsetScrollPos / (app.segmentHeight * 0.2)) * 50), 0, 200)

        // Time
        const currentTime = _round(offsetScrollPos / (app.segmentHeight * 0.2))

        // Segment group
        let currentSegmentGroup = Math.floor(currentTime * 0.2)

        // Create object
        scrollStatus = {
          scrollPos,
          offsetScrollPos,
          currentTime,
          currentSegmentGroup
        }

        // console.log('scrollStatus')
        // console.log(scrollStatus)

        // Emit position
        EventBus.$emit('scrollStatus', scrollStatus)
      }

      // Update local objects
      self.scrollStatus = scrollStatus
      self.currentSection = newCurrentSection

    }, SCROLL_UPDATE_INTERVAL, { 'leading': false, 'trailing': true })
  }
}
