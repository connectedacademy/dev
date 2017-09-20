const CALCULATE_FPS = false; // Calculate the scrolling FPS
const AUTOSCROLL_CHECK = 200; // Periodically check if scroll is possible
const AUTOSCROLL_ATTEMPT = 1000; // Interval at which to attempt auto scroll
const WHEEL_TIMEOUT = 1000; // Interval before assumed no longer manually scrolling
const SCROLL_UPDATE_INTERVAL = 500; // Interval at which scroll position should be updated
const SEGMENT_HEIGHT = 158.0; // Height of each segment

import Vue from 'vue';
import * as types from '@/store/mutation-types';
import { mapGetters } from 'vuex';

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

      var self = this;

      if (!self.canAutoScroll) { Vue.$log.debug('Cannot auto scroll'); self.isAutoScrolling = false; return; }
      if (self.isAutoScrolling) { Vue.$log.debug('Already auto scrolling'); return; }

      self.isAutoScrolling = true;

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
      var fps;

      var calculateFPS = function() {

        if(!lastCalledTime) {
           lastCalledTime = Date.now();
           fps = 0;
           frameCount = 0;
        }

        frameCount += 1;

        const delta = (Date.now() - lastCalledTime)/1000;
        lastCalledTime = Date.now();

        if ((frameCount % 30) === 0) {
          frameCount = 0;
          fps = 1/delta;
          fps   = _.round((100 / 60) * fps);
          self.fps = (fps > 60) ? '60+' : fps;
        }
      };

      var self = this;

      var step = function() {

        if (CALCULATE_FPS) { calculateFPS(); }

        var elapsed = Date.now() - clock;

        const yPos = position(start, end, elapsed, duration);

        // Vue.$log.debug(`step ${start} ${end} ${elapsed} ${duration} ${yPos}`);
        if (!self.preventScroll) {
          window.scroll(0, yPos);
        }

        if ((elapsed <= duration) && self.canAutoScroll) {
          requestAnimationFrame(step);
        }
        if (elapsed > duration) {
          self.$store.commit('setPendingScrollPosition', 0);
          self.$store.commit(types.PAUSE_VIDEO);
          self.attemptAutoScroll();
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

      this.wheeling = setTimeout(() => {

        // Wheeling stopped - fire events
        this.scrollPosition = window.scrollY;

        this.$store.dispatch('setScrollPosition', this.scrollPosition).then(() => {

          this.wheeling = undefined;
          this.preventScroll = false;
          
          // if (this.currentSection && (this.currentSection.content_type === 'class')) {
          //   this.$store.commit(types.PLAY_VIDEO);
          // }
        });

      }, WHEEL_TIMEOUT);
    },
    setScrollPosition: _.throttle(function(self) {
      this.scrollPosition = window.scrollY;
      self.$store.dispatch('setScrollPosition', this.scrollPosition);

    }, SCROLL_UPDATE_INTERVAL, { 'leading': false }),
    onScroll() {
      this.scrollPosition = window.scrollY;
      if (window.scrollY < 300) {
        this.preventScroll = true;
        this.$store.dispatch('setScrollPosition', this.scrollPosition).then(() => {
          this.preventScroll = false;
        });
      } else {
        this.setScrollPosition(this);
      }
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
