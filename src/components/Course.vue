<template lang="pug">

  .course-page(name="course-page")
    .col#col-main
      .main-container
        class-selector
        onboarding-prompt(identifier="intro-button" prompt="click for course intro" top="50" left="12" position="top-left" z-index="1")
        section-navigator
        course-content

</template>

<script>
// Components
import CourseContent from '@/components/conversation/CourseContent';
import ClassSelector from '@/components/ClassSelector';
import SectionNavigator from '@/components/navigation/SectionNavigator';

// Mixins
import AutoScroll from '@/mixins/AutoScroll';
import ScrollPoints from '@/mixins/ScrollPoints';

export default {
  name: 'course',
  mixins: [
    AutoScroll,
    ScrollPoints,
  ],
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit('SET_NAV_STATE', { minimized: false });
      vm.$store.commit('SET_PAGE_STYLE', undefined);
    });
  },
  beforeRouteLeave (to, from, next) {
    this.$store.dispatch('saveScrollPosition');
    this.$store.dispatch('resetState');
    next();
  },
  activated() {
    this.setScrollPoints();    
    window.scrollTo(0, this.$store.state.savedScrollPosition);
    // this.toMessage();
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
    };
  },
  components: {
    ClassSelector,
    CourseContent,
    SectionNavigator,
  },
  // methods: {
  //   toMessage() {
  //     if (this.$route.query.segment) {
  //       const segmentGroup = parseInt(this.$route.query.segment)
  //       setTimeout(() => {
  //         this.$store.commit('SET_PEEK_SEGMENT', segmentGroup);
  //         setTimeout(() => {
  //           var el = document.querySelector(".peek");
  //           window.scroll(0, this.$refs.innerwrapper.offsetTop + parseInt(el.getAttribute('data-top')));
  //         }, 1000);
  //       }, 2000);
  //     }
  //   },
  // },
};
</script>

<style lang="stylus">

@import '~stylus/shared'

</style>
