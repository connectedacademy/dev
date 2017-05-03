<template lang="pug">

  .col#col-main(ref="main" v-bind:class="this.$store.state.layout.columns.main.state" v-scroll="onScroll")

    .playhead

    .main-container

      .toolbar(v-if="currentClass")
        button.pure-button.pull-left(@click="classSelectorVisible = !classSelectorVisible")
          //- icon(name="cog")
          | {{ `${currentClass.title}` }}
        button.pure-button.pull-right(v-on:click="settingsVisible =! settingsVisible") Settings
        .clearfix

      class-selector(:class-selector-visible="classSelectorVisible")

      .stream(v-if="currentClass")
        pre-content
        class-content
        post-class-content
        webinar-content
        post-webinar-content

</template>

<script>
/* eslint-disable */
import _ from 'lodash';
import VueScroll from 'vue-scroll';

import * as types from '../store/mutation-types';
import ClassSelector from './ClassSelector';

import PreContent from './content/PreContent';
import ClassContent from './content/ClassContent';
import PostClassContent from './content/PostClassContent';
import WebinarContent from './content/WebinarContent';
import PostWebinarContent from './content/PostWebinarContent';

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

    // Listen for wheel events
    window.addEventListener('wheel', () => {
      self.throttledWheelMovement(self);
      self.wheelMovement(self);
    });

    // Attempt auto scroll every second
    setInterval(function() { self.attemptAutoScroll(); }, self.reattemptAutoScroll);

    this.toMessage(this.$route.query);
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      classSelectorVisible: true,
      settingsVisible: false,
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
    PreContent,
    ClassContent,
    PostClassContent,
    WebinarContent,
    PostWebinarContent,
  },
  watch: {
    'isAutoScrolling': {
      handler: function(oV, nV) {
        this.$store.commit('setAutoPlaying', nV);
      },
      deep: true,
    },
    'currentSection': {
      handler: function(oV, nV) {
        if (oV !== nV) {
          this.$store.dispatch('getSubtitles');
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
    wheelMovement() {
      this.canAutoScroll = false;
      this.isAutoScrolling = false;
    },
    throttledWheelMovement: _.throttle(function(self) {
      setTimeout(function() { self.canAutoScroll = true; }, 500);
    }, 500), // self.wheelMovementThrottle
    setScrollPosition: _.throttle(function(self, position) {
      self.$store.dispatch('setScrollPosition', position.scrollTop);
    }, 500), // self.scrollPositionThrottle
    onScroll(e, position) {
      this.setScrollPosition(this, position);
    },
    leaveClass() {
      this.$store.commit(types.SET_CURRENT_CLASS, undefined);
    },
    attemptAutoScroll() {

      var self = this;

      if (self.isAutoScrolling || !self.canAutoScroll || !self.$store.getters.currentSection) { return; }

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

        if ((elapsed <= duration) && self.canAutoScroll) {
          requestAnimationFrame(step);
        }
      }
      step();
    },
    toMessage(query) {
      if (query.class && query.content) {
        console.log(`${query.class} - ${query.content} - ${query.segment}`);

        // Set the class
        this.$store.commit(types.SET_CURRENT_CLASS, query.class);

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
  },
  computed: {
    course() {
      return this.$store.getters.course;
    },
    currentClass() {
      return this.$store.getters.currentClass;
    },
    scrollPosition() {
      return this.$store.getters.scrollPosition;
    },
    currentTime() {
      return this.$store.getters.currentTime;
    },
    currentSection() {
      return this.$store.getters.currentSection;
    },
    currentSectionLabel() {
      return this.$store.getters.currentSection.label;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '../assets/stylus/shared/*'

.playhead
  &:before, &:after
    content ''
    border-width 20px 6px 20px 6px
    border-style solid
    position fixed
    top 50%
    margin-top -5px
    height 0px
    width 0px
    z-index 50

  &:before
    left 0
    border-color transparent transparent transparent white
  &:after
    right 0
    border-color transparent white transparent transparent

.toolbar
  background-color white
  border-bottom #e1e1e1 1px solid
  padding 20px

.stream
  padding-bottom 80px

</style>
