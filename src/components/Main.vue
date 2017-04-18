<template lang="pug">

  .col#col-main(ref="main" v-bind:class="this.$store.state.layout.columns.main.state" @scroll="onScroll")

    class-selector(v-if="!currentClass")

    language-selector(v-if="currentClass")

    .stream(v-if="currentClass")
      pre-content
      class-content
      post-class-content
      webinar-content
      post-webinar-content

</template>

<script>
import ClassSelector from './ClassSelector';
import LanguageSelector from './LanguageSelector';

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
    this.$store.dispatch('setColumnState', 'narrow');
    this.$store.commit('setSession', { sid: this.$cookie.get('sails.sid') });
    this.$store.dispatch('getCourse');
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
    };
  },
  components: {
    ClassSelector,
    LanguageSelector,
    PreContent,
    ClassContent,
    PostClassContent,
    WebinarContent,
    PostWebinarContent,
  },
  methods: {
    onScroll() {
      let scrollPosition = this.$refs.main.scrollTop / 100;
      scrollPosition = (scrollPosition < 0) ? 0 : scrollPosition;
      this.$store.dispatch('setScrollPosition', scrollPosition);
    },
  },
  computed: {
    course() {
      return this.$store.getters.course;
    },
    currentClass() {
      return this.$store.getters.currentClass;
    },
  },
};
</script>

<style lang="stylus">

@import '../assets/stylus/shared/*'

ul.class-selector
  cleanlist()
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
