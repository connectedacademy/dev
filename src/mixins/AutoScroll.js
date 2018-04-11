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
    }, 2000)
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
      'mediaPlaying', 'activeSegment', 'peekSegment'
    ]),
    canAutoScroll() {
      return !this.peekSegment && !this.preventScroll && this.mediaPlaying && (typeof this.scrollStatus !== 'undefined')
    }
  },
  methods: {
    attemptAutoScroll() {

      Vue.$log.debug('Attempting auto scroll')

      if (!this.canAutoScroll) { Vue.$log.debug('Cannot auto scroll'); this.isAutoScrolling = false; this.onScroll(this); return }
      if (this.isAutoScrolling) { Vue.$log.debug('Already auto scrolling'); return }

      this.isAutoScrolling = true

      const end = this.end

      let position = function(start, end, elapsed, duration) {
        return start + (end - start) * (elapsed / duration) // Linear
      }

      const clock = Date.now()
      const requestAnimationFrame = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function(fn) { window.setTimeout(fn, 15) }

      const start = (this.scrollStatus && this.scrollStatus.scrollPos) ? this.scrollStatus.scrollPos : 0
      const durationRate = 5000

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

      const element = document.getElementById('liveclass');
      if (!element) return
      
      const content = _find(this.$store.getters.currentClass.content, { content_type: 'class' })
      
      if ((!element) || (typeof element === 'null') || (typeof element === 'undefined')) return
      
      // Offset
      const actionPanelHeight = 260
      const additionalOffset = 200

      const offsetScrollPos = scrollPos + window.innerHeight - (element.offsetTop + actionPanelHeight + additionalOffset)
      
      this.end = element.offsetTop + element.offsetHeight

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

      // console.log('scrollStatus')
      // console.log(scrollStatus)

      // Emit position
      EventBus.$emit('scrollStatus', scrollStatus)

      // Update local objects
      self.scrollStatus = scrollStatus

    }, SCROLL_UPDATE_INTERVAL, { 'leading': false, 'trailing': true })
  }
}
