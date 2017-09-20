const AUTOSCROLL_CHECK = 200; // Periodically check if scroll is possible
const AUTOSCROLL_ATTEMPT = 1000; // Interval at which to attempt auto scroll
const WHEEL_TIMEOUT = 1000; // Interval before assumed no longer manually scrolling
const SCROLL_UPDATE_INTERVAL = 750; // Interval at which scroll position should be updated
const SEGMENT_HEIGHT = 158.0; // Height of each segment

import Vue from 'vue';
import * as types from '@/store/mutation-types';
import { mapGetters } from 'vuex';
import throttle from 'lodash/throttle';

export default {
  mounted() {
    // Periodically check if scroll is possible
    window.setInterval(this.checkIfCanAutoScroll, AUTOSCROLL_CHECK);

    // Attempt auto scroll every second
    window.setInterval(this.attemptAutoScroll, AUTOSCROLL_ATTEMPT);

    // Listen for scroll events
    window.addEventListener('scroll', this.onScroll);

    // Listen for wheel events
    window.addEventListener('wheel', this.onWheel, { passive: true }); // Passive to improve mobile performance

    // Listen for mousedown events
    window.addEventListener('mousedown', this.onMousedown, { passive: true }); // Passive to improve mobile performance
    window.addEventListener('touchstart', this.onMousedown, { passive: true }); // Passive to improve mobile performance

    // Listen for mouseup events
    window.addEventListener('mouseup', this.onMouseup, { passive: true }); // Passive to improve mobile performance
    window.addEventListener('touchend', this.onMouseup, { passive: true }); // Passive to improve mobile performance
  },
  destroyed () {
    // Remove event listeners
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('mousedown', this.onMousedown);
    window.removeEventListener('mouseup', this.onMouseup);
  },
  data() {
    return {
      wheeling: false,
      canAutoScroll: true,
      isAutoScrolling: false,
      preventScroll: false,
    };
  },
  watch: {
    videoPlaying() {
      this.attemptAutoScroll();
    },
    // currentSection() {
    //   this.attemptAutoScroll();
    // },
  },
  computed: {
    ...mapGetters([
      'currentSection', 'videoPlaying', 'currentSectionScrollPosition', 'activeSegment', 'peekSegment',
    ]),
  },
  methods: {
    checkIfCanAutoScroll() {
      this.canAutoScroll = (!this.activeSegment && !this.peekSegment && !this.preventScroll && this.videoPlaying && (this.currentSection !== undefined) && (this.currentSection.content_type === 'class'));
    },
    attemptAutoScroll() {

      Vue.$log.debug('Attempting auto scroll');

      if (!this.canAutoScroll) { Vue.$log.debug('Cannot auto scroll'); this.isAutoScrolling = false; return; }
      if (this.isAutoScrolling) { Vue.$log.debug('Already auto scrolling'); return; }

      this.isAutoScrolling = true;

      var easingFunction = function (t) { return t<.2 ? -Math.cos((t * 1) * (Math.PI/2)) + 1 : t; };

      var position = function(start, end, elapsed, duration) {
        if (elapsed > duration) return end;

        // return start + (end - start) * easingFunction(elapsed / duration); // Easing
        return start + (end - start) * (elapsed / duration); // Linear
      }

      var clock = Date.now();
      var requestAnimationFrame = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function(fn) { window.setTimeout(fn, 15); };

      var start = this.scrollPosition;
      // var end = this.currentSection.bottom;
      // alert(this.$store.state.pendingScrollPosition);
      let durationRate = 5000;
      let end = this.currentSection.bottom;

      if (this.$store.state.pendingScrollPosition !== 0) {
        this.$store.commit(types.PLAY_VIDEO);
        end = this.$store.state.pendingScrollPosition;
        durationRate = 500;
      }

      var duration = (((end - start) / (SEGMENT_HEIGHT * 1.0)) * durationRate);

      var lastCalledTime;
      var frameCount;

      var step = () => {

        var elapsed = Date.now() - clock;

        const yPos = position(start, end, elapsed, duration);

        // Vue.$log.debug(`step ${start} ${end} ${elapsed} ${duration} ${yPos}`);
        if (!this.preventScroll) {
          window.scroll(0, yPos);
        }

        if ((elapsed <= duration) && this.canAutoScroll) {
          requestAnimationFrame(step);
        }
        if (elapsed > duration) {
          this.$store.commit('setPendingScrollPosition', 0);
          this.$store.commit(types.PAUSE_VIDEO);
          this.attemptAutoScroll();
        }
      }
      step();
    },
    wheelMovement() {

      if (this.activeSegment || this.peekSegment || this.preventScroll) {
        return;
      }
      this.$store.commit(types.PAUSE_VIDEO);
      this.preventScroll = true;
      this.isAutoScrolling = false;

      clearTimeout(this.wheeling);

      var self = this;

      this.wheeling = setTimeout(() => {

        // Wheeling stopped - fire events
        this.scrollPosition = window.scrollY;

        this.$store.dispatch('setScrollPosition', this.scrollPosition).then(() => {

          this.wheeling = undefined;
          self.preventScroll = false;
          
          // if (this.currentSection && (this.currentSection.content_type === 'class')) {
          //   this.$store.commit(types.PLAY_VIDEO);
          // }
        });

      }, WHEEL_TIMEOUT);
    },
    setScrollPosition: throttle(function(self) {
      self.scrollPosition = window.scrollY;
      self.$store.dispatch('setScrollPosition', self.scrollPosition);

    }, SCROLL_UPDATE_INTERVAL, { 'leading': false }),
    onScroll() {
      this.scrollPosition = window.scrollY;
      this.setScrollPosition(this);
    },
    onWheel() {
      if (!this.activeSegment) {
        this.wheelMovement(this);
      }
    },
    onMousedown() {
      Vue.$log.debug('MOUSEDOWN');
      // this.$store.commit(types.PAUSE_VIDEO);
      this.preventScroll = true;
      this.isAutoScrolling = false;
    },
    onMouseup() {
      Vue.$log.debug('MOUSEUP');
      // this.$store.commit(types.PLAY_VIDEO);
      this.preventScroll = false;
      this.isAutoScrolling = false;
    },
  },
}
