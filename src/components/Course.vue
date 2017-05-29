<template lang="pug">

  .col#col-main(ref="main" v-bind:class="this.$store.state.layout.columns.main.state")

    .scroll-indicator(v-bind:style="scrollIndicatorStyle" v-if="this.offsetScrollPosition > 0")

    .main-container

      class-selector

      transition(name="fade" mode="out-in")

        course-content(v-if="currentClass" v-bind:course-content="courseContent")

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
  name: 'course',
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
  },
  methods: {
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
      'isAuthenticated', 'isRegistered', 'course', 'currentClass', 'offsetScrollPosition', 'courseContent',
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
@import "../assets/stylus/layout/course-content"

.scroll-indicator
  animate()
  radius(50%)
  background-color $color-primary
  left 50%
  margin-left 380px
  position absolute
  height 10px
  z-index 100
  width 10px

</style>
