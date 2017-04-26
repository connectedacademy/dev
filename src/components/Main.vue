<template lang="pug">

  .col#col-main(ref="main" v-bind:class="this.$store.state.layout.columns.main.state" v-scroll="onScroll")

    .main-container

      .toolbar(v-if="currentClass")
        button.pure-button.pure-button-primary.pull-left(@click="classSelectorVisible = !classSelectorVisible") {{ `Current Class: ${currentClass.title}` }}
        button.pure-button.pure-button-primary.pull-right(v-on:click="settingsVisible =! settingsVisible") Settings
        .clearfix

      class-selector(v-bind:class="{ 'hidden': !classSelectorVisible }")

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
    window.addEventListener('wheel', () => { self.wheelMovement(self); });

    // Attempt auto scroll every second
    setInterval(function() { self.attemptAutoScroll(); }, self.reattemptAutoScroll);
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
      wheelMovementThrottle: 200,
      scrollPositionThrottle: 200,
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
    wheelMovement: _.throttle(function(self) {
      self.canAutoScroll = self.isAutoScrolling = false;
      setTimeout(function() { self.canAutoScroll = true; }, self.restartAutoScroll);
    }, self.wheelMovementThrottle),
    setScrollPosition: _.throttle(function(self, position) {
      self.$store.dispatch('setScrollPosition', position.scrollTop);
    }, self.scrollPositionThrottle, { leading: true, trailing: true }),
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
      var duration = (((end - start) / 158) * 1000);

      var step = function() {
        var elapsed = Date.now() - clock;

        self.$refs.main.scrollTop = position(start, end, elapsed, duration); //target; // position(start, end, elapsed, duration);

        if ((elapsed <= duration) && self.canAutoScroll) {
          requestAnimationFrame(step);
        }
      }
      step();
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

.toolbar
  background-color white
  border-bottom #e1e1e1 1px solid
  padding 20px

ul.class-selector
  cleanlist()
  &.hidden
    display none
  li.class-selector--item
    cleanlist()
    background-color white
    margin 20px
    padding 15px
    width 160px
    h1.class-selector--item--header
      nomargin()
      nopadding()
      color $color-text-dark-grey
      font-size 1.1em
      margin-bottom 5px
    h2.class-selector--item--body
      nomargin()
      nopadding()
      color $color-text-grey
      font-size 1em
      font-weight normal

.stream
  padding-bottom 80px

</style>
