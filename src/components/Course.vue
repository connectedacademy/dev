<template lang="pug">

  .course-page

    .col#col-main(ref="main" v-bind:class="this.$store.state.layout.columns.main.state")

      .main-container

        class-selector
        //- full-class-selector

        course-content(v-bind:course-content="courseContent")

</template>

<script>
/* eslint-disable */
import _ from 'lodash';
import { mapGetters } from 'vuex';

import * as types from '@/store/mutation-types';

import AnimatedLogo from '@/components/AnimatedLogo';
import ClassSelector from '@/components/ClassSelector';
import FullClassSelector from '@/components/FullClassSelector';

import CourseContent from '@/components/conversation/CourseContent';

import MarkdownRenderer from '@/components/MarkdownRenderer';

export default {
  name: 'course',
  beforeRouteLeave (to, from, next) {
    // Reset state
    this.$store.dispatch('resetState');
    next();
  },
  mounted() {
    this.$store.dispatch('checkAuth');

    this.toMessage(this.$route.query);
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
    FullClassSelector,
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
      'currentClass', 'courseContent',
    ]),
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

</style>
