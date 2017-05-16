<template lang="pug">

  .col#col-main(ref="main" v-bind:class="this.$store.state.layout.columns.main.state" v-scroll="onScroll")

    .scroll-indicator(v-bind:style="scrollIndicatorStyle")

    .main-container

      .container.background-white(v-if="infoVisible")
        markdown-renderer(markdown-url="https://testclass.connectedacademy.io/course/content/en/info.md")

      .toolbar(v-if="currentClass")

        button.pure-button.pull-left(@click="classSelectorVisible = !classSelectorVisible")
          | {{ `${currentClass.title}` }}

        button.pure-button.pull-right(v-on:click="infoVisible =! infoVisible")
          | {{ $t('course.course_info') }}

        button.pure-button.pull-right(v-on:click="handleResize")
          | Resize

        .clearfix

      class-selector(v-bind:is-visible="classSelectorVisible" v-on:setCurrentClass="hideClassSelector")

      course-content(v-if="currentClass")

</template>

<script>
/* eslint-disable */
import _ from 'lodash';
import { mapGetters } from 'vuex';
import VueScroll from 'vue-scroll';

import * as types from '@/store/mutation-types';
import ClassSelector from './ClassSelector';

import CourseContent from '@/components/conversation/CourseContent';

import MarkdownRenderer from '@/components/MarkdownRenderer';

export default {
  name: 'main',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.dispatch('checkAuth');
    });
  },
  created() {
    // Check if user has registered
    if (this.$store.state.auth.isAuthenticated && !this.$store.getters.isRegistered) {
      this.$router.push('/registration');
    }
  },
  mounted() {
    this.$store.dispatch('setColumnState', 'narrow');
    this.$store.dispatch('getCourse');

    var self = this;

    // Update scroll points
    // setInterval(function() {
    //   self.setScrollPoints();
    // }, 1000);

    // Listen for wheel events
    window.addEventListener('wheel', () => {
      self.throttledWheelMovement(self);
      self.wheelMovement(self);
    });

    // Listen for resize events
    window.addEventListener('resize', () => {
      console.log('Resized window');
      // self.setScrollPosition(this.$refs.main, 800);
      // self.$store.dispatch('setScrollPosition', position.scrollTop);
      // document.getElementById('col-main').scrollTop = 1200;
      // this.setScrollPosition(this, 1200);
    });

    // Attempt auto scroll every second
    setInterval(function() { self.attemptAutoScroll(); }, self.reattemptAutoScroll);

    this.toMessage(this.$route.query);
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      classSelectorVisible: true,
      infoVisible: false,
      canAutoScroll: false,
      isAutoScrolling: false,
      reattemptAutoScroll: 500,
      restartAutoScroll: 500,
      wheelMovementThrottle: 500,
      scrollPositionThrottle: 500,
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
      handler: function(oV, nV) {
        this.attemptAutoScroll();
      },
      deep: true,
    },
    'isAutoScrolling': {
      handler: function(oV, nV) {
        this.$store.commit('setAutoPlaying', nV);
      },
      deep: true,
    },
    'currentSection': {
      handler: function(oV, nV) {
        if (oV !== nV) {
          const request = {
            theClass: this.$store.getters.currentClass.slug,
            theContent: 'liveclass',// this.content.slug
          };

          this.$store.dispatch('getVisualisation', request).then(() => {
            this.$store.dispatch('getSubtitles');
          });
        }
        if (!this.canAutoScroll) {
          if ((oV !== nV) && (nV !== undefined)) {
            this.canAutoScroll = true;
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    handleResize() {
      this.setScrollPoints();
    },
    setScrollPoints() {
      for (var content of this.$store.getters.currentClass.content) {
        if (content.slug) {

          const element = document.getElementById('course-content-' + content.slug);

          if (element) {

            const parentOffset = element.parentElement.offsetTop;

            console.log('element');
            console.log(element);

            console.log('element.offsetHeight');
            console.log(element.offsetHeight);

            this.$store.commit('setScrollPoint', {
              slug: content.slug,
              top: (parentOffset + element.offsetTop),
              bottom: (parentOffset + element.offsetTop) + element.offsetHeight,
              duration: content.duration,
              videoId: content.video,
              transcript: content.transcript,
            });
          }
        }
      }
    },
    wheelMovement() {
      this.canAutoScroll = false;
      this.isAutoScrolling = false;
    },
    throttledWheelMovement: _.throttle(function(self) {
      setTimeout(function() { self.canAutoScroll = true; }, 500);
    }, 500, { 'trailing': true }), // self.wheelMovementThrottle
    setScrollPosition: _.throttle(function(self, position) {
      self.$store.dispatch('setScrollPosition', position.scrollTop);
    }, 500, { 'trailing': true }), // self.scrollPositionThrottle
    onScroll(e, position) {
      this.setScrollPosition(this, position);
    },
    leaveClass() {
      this.$store.dispatch('getSpec', undefined);
    },
    attemptAutoScroll() {

      var self = this;

      if (self.isAutoScrolling || !self.canAutoScroll || !self.currentSection || !self.videoPlaying || !self.videoReady) { return; }

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

      var start = this.$store.getters.scrollPosition;
      var end = this.$store.getters.currentSection.bottom;
      var duration = (((end - start) / (158.0 * 1.0)) * 5000);

      var step = function() {
        var elapsed = Date.now() - clock;

        self.$refs.main.scrollTop = position(start, end, elapsed, duration);

        if ((elapsed <= duration) && self.canAutoScroll && self.videoPlaying) {
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
          const scrollPoint = self.$store.getters.scrollPoints[query.content];
          self.$refs.main.scrollTop = scrollPoint.top + (query.segment * (158.0 * 0.2));
        }, 1000);

      }
      else {
        console.log('No query passed');
      }
    },
    hideClassSelector() {
      this.classSelectorVisible = false
    },
  },
  computed: {
    ...mapGetters([
      'course', 'currentClass', 'scrollPosition', 'offsetScrollPosition', 'currentTime', 'currentSection', 'videoPlaying', 'videoReady', 'currentSectionScrollPosition',
    ]),
    pastMidPoint() {
      return (this.currentSectionScrollPosition > (document.getElementById('col-main').offsetHeight / 2.0))
    },
    currentSectionLabel() {
      return this.$store.getters.currentSection.label;
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

.scroll-indicator
  background-color red
  left 0
  position absolute
  height 2px
  z-index 100
  width 20px

.toolbar
  background-color white
  border-bottom #e1e1e1 1px solid
  padding 20px

.stream
  padding-bottom 80px

</style>
