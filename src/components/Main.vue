<template lang="pug">

  .col#col-main(ref="main" v-bind:class="this.$store.state.layout.columns.main.state" @scroll="onScroll")

    .toolbar(v-if="currentClass")
      button.pure-button.pure-button-primary.pull-left(v-on:click="classSelectorVisible =! classSelectorVisible") Select Class
      button.pure-button.pure-button-primary.pull-right(v-on:click="settingsVisible =! settingsVisible") Settings
      .clearfix

    class-selector(v-bind:class="{ 'class-selected': currentClass, 'hidden': classSelectorVisible }")

    .stream(v-if="currentClass")
      pre-content
      class-content
      postclass-content
      webinar-content
      post-webinar-content

</template>

<script>
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
    this.$store.dispatch('setColumnState', 'narrow');
    this.$store.commit('setSession', { sid: this.$cookie.get('sails.sid') });
    this.$store.dispatch('getCourse');
    // Check if user has registered
    if (this.$store.state.auth.isAuthenticated && !this.$store.getters.isRegistered) {
      this.$router.push('/registration');
    }
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      classSelectorVisible: false,
      settingsVisible: false,
    };
  },
  components: {
    ClassSelector,
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

.toolbar
  border-bottom alpha(white, 0.1) 1px solid
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
