<template lang="pug">

  .col#col-main(ref="main" v-bind:class="this.$store.state.layout.columns.main.state" v-scroll="onScroll")

    .scroll-indicator(v-bind:style="scrollIndicatorStyle" v-if="this.offsetScrollPosition > 0")

    .fps-indicator {{ fps }}

    .main-container

      .toolbar.hidden

        button.pure-button.pull-left(v-on:click="infoVisible =! infoVisible")
          | {{ $t('course.course_info') }}

        button.pure-button.pull-right(v-on:click="setScrollPoints")
          | Set Scroll Points

        .clearfix

      .container.background-white(v-if="infoVisible")
        markdown-renderer(markdown-url="https://testclass.connectedacademy.io/course/content/en/info.md")

      class-selector

      course-content(v-if="currentClass")

</template>

<script>
/* eslint-disable */
import _ from 'lodash';
import { mapGetters } from 'vuex';
import VueScroll from 'vue-scroll';

import ScrollPoints from '@/mixins/ScrollPoints';

import * as types from '@/store/mutation-types';
import ClassSelector from './ClassSelector';

import CourseContent from '@/components/conversation/CourseContent';

import MarkdownRenderer from '@/components/MarkdownRenderer';

export default {
  name: 'main',
  mixins: [
    ScrollPoints,
  ],
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.dispatch('checkAuth');
    });
  },
  beforeRouteLeave (to, from, next) {
    // Reset state
    this.$store.dispatch('resetState');
    next();
  },
  created() {
    // Check if user has registered
    if (this.isAuthenticated && !this.isRegistered) {
      this.$router.push('/registration');
    }
  },
  mounted() {
    this.$store.dispatch('setColumnState', 'narrow');
    // this.$store.dispatch('getCourse');

    var self = this;

    // Listen for wheel events
    window.addEventListener('wheel', () => {
      self.throttledWheelMovement(self);
      self.wheelMovement(self);
    });

    // Listen for resize events
    window.addEventListener('resize', () => {
      console.log('Resized window');
    });

    // Attempt auto scroll every second
    setInterval(function() { self.attemptAutoScroll(); }, self.reattemptAutoScroll);

    this.toMessage(this.$route.query);
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      infoVisible: false,
      isAutoScrolling: false,
      reattemptAutoScroll: 500,
      fps: 0,
    };
  },
  components: {
    VueScroll,
    ClassSelector,
    CourseContent,
    MarkdownRenderer,
  },
  watch: {
    'videoReady': {
      handler: function(nV, oV) {
        this.attemptAutoScroll();
      },
      deep: true,
    },
    'isAutoScrolling': {
      handler: function(nV, oV) {
        this.$store.commit('setAutoPlaying', nV);
      },
      deep: true,
    },
    'currentSection': {
      handler: function(nV, oV) {
        if (nV !== undefined) {
          if (oV !== nV) {
            if (nV.content_type === 'class') {

              const request = {
                theClass: this.$store.getters.currentClass.slug,
                theContent: this.currentSection.slug,
              };

              this.$store.dispatch('getVisualisation', request);
              this.$store.dispatch('getSubtitles');
            }
          }
          if (!this.canAutoScroll) {
            if (oV !== nV) {
              if (nV.duration !== undefined) {
                this.$store.commit('setCanAutoScroll', true);
              }
            }
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    wheelMovement() {
      this.isAutoScrolling = false;
      this.$store.commit('setCanAutoScroll', false);
    },
    throttledWheelMovement: _.throttle(function(self) {
      setTimeout(function() {
        if (self.currentSection !== undefined) {
          if (self.currentSection.duration !== undefined) {
            self.$store.commit('setCanAutoScroll', true);
          }
        }
      }, 500);
    }, 500),
    setScrollPosition: _.throttle(function(self, position) {
      self.$store.dispatch('setScrollPosition', position.scrollTop);
    }, 500, { 'leading': false }),
    onScroll(e, position) {
      this.setScrollPosition(this, position);
    },
    leaveClass() {
      this.$store.dispatch('getSpec', undefined);
    },
    attemptAutoScroll() {

      var self = this;

      if (self.isAutoScrolling || !self.canAutoScroll || (self.currentSection === undefined) || !self.videoPlaying || !self.videoReady || (self.$refs.main === undefined)) { return; }

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

      var step = function() {

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

        var elapsed = Date.now() - clock;

        self.$refs.main.scrollTop = position(start, end, elapsed, duration);

        if ((elapsed <= duration) && self.canAutoScroll && self.videoPlaying && (self.currentSection !== undefined)) {
          requestAnimationFrame(step);
        }
      }
      step();
    },
    toMessage(query) {
      if (query.class && query.content) {
        console.log(`${query.class} - ${query.content} - ${query.segment}`);

        // Set the class
        this.$store.dispatch('getSpec', query.class);

        // Set the current section/scroll position
        var self = this;
        setTimeout(function() {
          const scrollPoint = self.$store.state.scrollPoints[query.content];
          self.$refs.main.scrollTop = scrollPoint.top + (query.segment * (158.0 * 0.2));
        }, 1000);

      }
      else {
        console.log('No query passed');
      }
    },
  },
  computed: {
    ...mapGetters([
      'isAuthenticated', 'isRegistered', 'course', 'currentClass', 'scrollPosition', 'offsetScrollPosition', 'currentTime', 'currentSection', 'videoPlaying', 'videoReady', 'canAutoScroll', 'currentSectionScrollPosition',
    ]),
    pastMidPoint() {
      return (this.currentSectionScrollPosition > (document.getElementById('col-main').offsetHeight / 2.0))
    },
    scrollIndicatorStyle() {
      return {
        top: `${this.offsetScrollPosition}px`,
      };
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '../assets/stylus/shared/*'

.fps-indicator
  radius(50%)
  background-color red
  color white
  position fixed
  top 100px
  left 10px
  height 40px
  line-height 40px
  padding 0
  width 40px
  z-index 999
  text-align center

.scroll-indicator
  radius(50%)
  animate()
  background-color $color-primary
  left 5px
  position absolute
  height 10px
  z-index 100
  width 10px

.toolbar
  background-color white
  border-bottom #e1e1e1 1px solid
  padding 10px
  .pure-button
    margin 10px

.stream
  padding-bottom 80px

</style>
