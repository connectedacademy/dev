<template lang="pug">

  .course-page
    .col#col-main
      .main-container
        class-selector
        course-content

</template>

<script>
import ClassSelector from '@/components/ClassSelector';
import Loading from '@/components/Loading';

const CourseContent = () => ({
  // The component to load. Should be a Promise
  component: import('@/components/conversation/CourseContent'),
  // A component to use while the async component is loading
  loading: Loading,
  // A component to use if the load fails
  // error: ErrorComp,
  // Delay before showing the loading component. Default: 200ms.
  delay: 10,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 3000
});

export default {
  name: 'course',
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
    this.$store.dispatch('checkAuth');
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
  },
  methods: {
    toMessage() {
      alert('toMessage');
      const query = this.$route.query;
      if (query.class && query.content) {
        // Set the class
        this.$store.dispatch('getSpec', query.class);

        // Set the current section/scroll position
        setTimeout(() => {
          // const scrollPoint = this.$store.state.scrollPoints[query.content];
          // this.$refs.main.scrollTop = scrollPoint.top + (query.segment * (158.0 * 0.2));
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
