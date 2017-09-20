<template lang="pug">

  .course-page

    .col#col-main(ref="main")

      .main-container

        class-selector

        course-content(v-bind:course-content="courseContent")

</template>

<script>
/* eslint-disable */
import _ from 'lodash/core';
import { mapGetters } from 'vuex';

import * as types from '@/store/mutation-types';

import AnimatedLogo from '@/components/AnimatedLogo';
import ClassSelector from '@/components/ClassSelector';

import CourseContent from '@/components/conversation/CourseContent';

import MarkdownRenderer from '@/components/MarkdownRenderer';

export default {
  name: 'course',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(types.SET_NAV_STATE, { minimized: false });
      vm.$store.commit(types.SET_PAGE_STYLE, undefined);
    });
  },
  beforeRouteLeave (to, from, next) {
    this.$store.dispatch('saveScrollPosition');
    this.$store.dispatch('resetState');
    next();
  },
  activated() {
    this.$store.dispatch('checkAuth');
    window.scrollTo(0, this.$store.state.savedScrollPosition);
    // this.toMessage();
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      infoVisible: false,
      loaded: false,
    };
  },
  components: {
    AnimatedLogo,
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
  computed: {
    ...mapGetters([
      'currentClass', 'courseContent',
    ]),
  },
  methods: {
    leaveClass() {
      this.$store.dispatch('getSpec', undefined);
    },
    toMessage() {
      alert('toMessage');
      const query = this.$route.query;
      if (query.class && query.content) {
        // Set the class
        this.$store.dispatch('getSpec', query.class);

        // Set the current section/scroll position
        setTimeout(() => {
          const scrollPoint = this.$store.state.scrollPoints[query.content];
          this.$refs.main.scrollTop = scrollPoint.top + (query.segment * (158.0 * 0.2));
        }, 1000);

      }
      else {
        this.$log.info('No query passed');
      }
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

</style>
