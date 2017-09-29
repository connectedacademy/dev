import Vue from 'vue';
import { mapGetters } from 'vuex';
import throttle from 'lodash/throttle';

const AUTOSCROLL_ATTEMPT = 1000; // Interval at which to attempt auto scroll
const WHEEL_TIMEOUT = 1000; // Interval before assumed no longer manually scrolling
const SCROLL_UPDATE_INTERVAL = 500;//750; // Interval at which scroll position should be updated

export default {
  mounted() {
    setTimeout(() => {
      // Attempt auto scroll every second
      window.setInterval(this.attemptAutoScroll, AUTOSCROLL_ATTEMPT);

      // Listen for scroll events
      window.addEventListener('scroll', () => {
        this.onScroll(this);
      }, { passive: true });

      // Listen for wheel events
      window.addEventListener('wheel', this.onWheel, { passive: true }); // Passive to improve mobile performance

      // Listen for mousedown events
      // window.addEventListener('mousedown', this.onMousedown, { passive: true }); // Passive to improve mobile performance
      // window.addEventListener('touchstart', this.onMousedown, { passive: true }); // Passive to improve mobile performance

      // Listen for mouseup events
      // window.addEventListener('mouseup', this.onMouseup, { passive: true }); // Passive to improve mobile performance
      // window.addEventListener('touchend', this.onMouseup, { passive: true }); // Passive to improve mobile performance
    }, 2500);
  },
  destroyed () {
    // Remove event listeners
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('wheel', this.onWheel);
    // window.removeEventListener('mousedown', this.onMousedown);
    // window.removeEventListener('mouseup', this.onMouseup);
  },
  data() {
    return {
      wheeling: false,
      canAutoScroll: false,
      isAutoScrolling: false,
      preventScroll: false,
      scrollPosition: 0,
    };
  },
  watch: {
    peekSegment(nV) {
      this.checkIfCanAutoScroll();
    },
    preventScroll(nV) {
      this.checkIfCanAutoScroll();
    },
    mediaPlaying(nV) {
      this.checkIfCanAutoScroll();
      if (nV) { this.attemptAutoScroll(); }
    },
    currentSection(nV) {
      this.checkIfCanAutoScroll();
    },
    scrollPosition(nV) {
      this.$store.dispatch('setScrollPosition', nV);
    }
  },
  computed: {
    ...mapGetters([
      'currentSection', 'mediaPlaying', 'currentSectionScrollPosition', 'activeSegment', 'peekSegment',
    ]),
  },
  methods: {
    checkIfCanAutoScroll() {
      this.canAutoScroll = (!this.peekSegment && !this.preventScroll && this.mediaPlaying && (this.currentSection !== undefined));
    },
    attemptAutoScroll() {

      Vue.$log.debug('Attempting auto scroll');

      if (!this.canAutoScroll) { Vue.$log.debug('Cannot auto scroll'); this.isAutoScrolling = false; return; }
      if (this.isAutoScrolling) { Vue.$log.debug('Already auto scrolling'); return; }

      this.isAutoScrolling = true;

      // var easingFunction = function (t) { return t<.2 ? -Math.cos((t * 1) * (Math.PI/2)) + 1 : t; };

      var position = function(start, end, elapsed, duration) {
        return start + (end - start) * (elapsed / duration); // Linear
        // return start + (end - start) * easingFunction(elapsed / duration); // Easing
      }

      const clock = Date.now();
      const requestAnimationFrame = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function(fn) { window.setTimeout(fn, 15); };

      var start = this.scrollPosition;
      const durationRate = 5000;
      let end = this.currentSection.bottom;

      var duration = (((end - start) / (this.$app.segmentHeight * 1.0)) * durationRate);

      var step = () => {

        var elapsed = Date.now() - clock;

        const yPos = position(start, end, elapsed, duration);

        if (!this.preventScroll) {
          window.scroll(0, yPos);
        }

        if ((elapsed <= duration) && this.canAutoScroll) {
          requestAnimationFrame(step);
        }
        else if (elapsed > duration) {
          this.$store.commit('PAUSE_MEDIA');
        }
      }
      step();
    },
    wheelMovement() {

      if (this.peekSegment || this.preventScroll) {
        return;
      }
      if (this.mediaPlaying) {
        this.$store.commit('PAUSE_MEDIA');
      }
      this.preventScroll = true;
      this.isAutoScrolling = false;

      clearTimeout(this.wheeling);

      this.wheeling = setTimeout(() => {

        // Wheeling stopped - fire events
        this.scrollPosition = window.scrollY;
      
        this.wheeling = undefined;
        this.preventScroll = false;
          
        // if (this.currentSection) {
        //   this.$store.commit('PLAY_MEDIA');
        // }
      }, WHEEL_TIMEOUT);
    },
    onScroll: throttle(function (self) {
      if (Math.abs(self.scrollPosition - window.scrollY) > 50) {
        console.log(Math.abs(self.scrollPosition - window.scrollY));
        self.scrollPosition = window.scrollY;
      }
    }, SCROLL_UPDATE_INTERVAL, { 'leading': false }),
    onWheel() {
      if (!this.activeSegment) {
        this.wheelMovement(this);
      }
    },
    onMousedown() {
      Vue.$log.debug('MOUSEDOWN');
      // this.$store.commit('PAUSE_MEDIA');
      this.preventScroll = true;
      this.isAutoScrolling = false;
    },
    onMouseup() {
      Vue.$log.debug('MOUSEUP');
      // this.$store.commit('PLAY_MEDIA');
      this.preventScroll = false;
      this.isAutoScrolling = false;
    },
  },
}
