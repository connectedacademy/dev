const CALCULATE_FPS = false; // Calculate the scrolling FPS
const AUTOSCROLL_CHECK = 500; // Periodically check if scroll is possible
const AUTOSCROLL_ATTEMPT = 1000; // Interval at which to attempt auto scroll
const WHEEL_TIMEOUT = 500; // Interval before assumed no longer manually scrolling
const SCROLL_UPDATE_INTERVAL = 500; // Interval at which scroll position should be updated

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
  },
  destroyed () {
    // Remove event listeners
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('wheel', this.onWheel);
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
    videoReady() {
      this.attemptAutoScroll();
    },
    videoPlaying() {
      this.attemptAutoScroll();
    },
    currentSection() {
      this.attemptAutoScroll();
    },
  },
  computed: {
    ...mapGetters([
      'currentSection', 'videoPlaying', 'videoReady', 'currentSectionScrollPosition', 'activeSegmentVisible',
    ]),
  },
  methods: {
    checkIfCanAutoScroll() {
      this.canAutoScroll = (!this.activeSegmentVisible && !this.preventScroll && this.videoReady && this.videoPlaying && (this.currentSection !== undefined));
    },
    attemptAutoScroll() {

      Vue.log.log('Attempting auto scroll');

      var self = this;

      if (!self.canAutoScroll) { Vue.log.log('Cannot auto scroll'); self.isAutoScrolling = false; return; }
      if (self.isAutoScrolling) { Vue.log.log('Already auto scrolling'); return; }

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
      var end = this.currentSection.bottom;

      var duration = (((end - start) / (158.0 * 1.0)) * 5000);

      var lastCalledTime;
      var frameCount;
      var fps;

      var calculateFPS = function() {

        if (!CALCULATE_FPS) { return; }

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

      var step = function() {

        calculateFPS();

        var elapsed = Date.now() - clock;

        const yPos = position(start, end, elapsed, duration);

        // Vue.log.log(`step ${start} ${end} ${elapsed} ${duration} ${yPos}`);
        if (!self.preventScroll) {
          window.scroll(0, yPos);
        }

        if ((elapsed <= duration) && self.canAutoScroll) {
          requestAnimationFrame(step);
        }
      }
      step();
    },
    wheelMovement() {
      var self = this;

      this.$store.commit(types.PAUSE_VIDEO);
      this.preventScroll = true;
      this.isAutoScrolling = false;

      clearTimeout(this.wheeling);

      this.wheeling = setTimeout(function() {

        // Wheeling stopped - fire events
        self.scrollPosition = window.scrollY;

        if (self.currentSectionScrollPosition > 300) {

          self.$store.dispatch('setScrollPosition', self.scrollPosition).then(function() {

            self.wheeling = undefined;
            self.preventScroll = false;

            self.$store.commit(types.PLAY_VIDEO);
          });

        } else {

          // Jump to 0
          self.$store.commit(types.PAUSE_VIDEO);
          const yPos = (self.scrollPosition - self.currentSectionScrollPosition) + 1;

          self.$store.dispatch('setScrollPosition', yPos).then(function() {

            window.scroll(0, yPos);

            self.wheeling = undefined;
            self.preventScroll = false;

            self.$store.commit(types.PLAY_VIDEO);
          });

        }

      }, WHEEL_TIMEOUT);
    },
    setScrollPosition: _.throttle(function(self) {
      this.scrollPosition = window.scrollY;
      self.$store.dispatch('setScrollPosition', this.scrollPosition).then(function() {
        if (self.scrollPosition > 100) {
          self.$store.commit(types.SET_NAV_STATE, { minimized: true });
        } else {
          self.$store.commit(types.SET_NAV_STATE, { minimized: false });
        }
      });
    }, SCROLL_UPDATE_INTERVAL, { 'leading': false }),
    onScroll() {
      var self = this;
      this.scrollPosition = window.scrollY;
      if (window.scrollY < 300) {
        this.preventScroll = true;
        this.$store.dispatch('setScrollPosition', this.scrollPosition).then(function() {
          self.preventScroll = false;
        });
      } else {
        this.setScrollPosition(this);
      }
    },
    onWheel() {
      if (!this.activeSegmentVisible) {
        this.wheelMovement(this);
      }
    },
  },
}
