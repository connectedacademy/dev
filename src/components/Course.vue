<template lang="pug">

  .course-page(name="course-page")
    .col#col-main
      .main-container
        class-selector
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
  methods: {
    toMessage() {},
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

</style>
