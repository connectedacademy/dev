<template lang="pug">

  .col#col-main(ref="main" v-bind:class="this.$store.state.layout.columns.main.state")

    .scroll-indicator(v-bind:style="scrollIndicatorStyle" v-if="this.offsetScrollPosition > 0")

    //- .fps-indicator {{ fps }}

    .main-container

      //- .toolbar

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
    this.toMessage(this.$route.query);
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      infoVisible: false,
      fps: 0,
      canLoadNextFrame: false,
    };
  },
  components: {
    ClassSelector,
    CourseContent,
    MarkdownRenderer,
  },
  watch: {
    'isAutoScrolling': {
      handler: function(nV, oV) {
        this.$store.commit('setAutoPlaying', nV);
      },
      deep: true,
    },
    canAutoScroll() {
      this.checkIfCanLoadNextFrame();
    },
    videoPlaying() {
      this.checkIfCanLoadNextFrame();
    },
    currentSection() {
      this.checkIfCanLoadNextFrame();
    },
  },
  methods: {
    checkIfCanLoadNextFrame() {
      this.canLoadNextFrame = (this.canAutoScroll && this.videoPlaying && (this.currentSection !== undefined));
    },
    leaveClass() {
      this.$store.dispatch('getSpec', undefined);
    },
    toMessage(query) {
      if (query.class && query.content) {
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
        this.$log.log('No query passed');
      }
    },
  },
  computed: {
    ...mapGetters([
      'isAuthenticated', 'isRegistered', 'course', 'currentClass', 'scrollPosition', 'offsetScrollPosition', 'currentTime', 'currentSection', 'videoPlaying', 'canAutoScroll', 'currentSectionScrollPosition',
    ]),
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
