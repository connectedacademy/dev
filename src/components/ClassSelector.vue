<template lang="pug">

.class-selector
  transition(name="fade")
    .class-selector-wrapper(v-if="course && course.classes")
      .skip-button.skip-button--left(@click="scrollLeft" v-if="offset > 0")
        icon(name="angle-left")
      .skip-button.skip-button--right(@click="scrollRight" v-if="remainingOffset > 0")
        icon(name="angle-right")
      .class-selector-container-wrapper
        .class-selector-container(ref="classselector" v-scroll="onScroll")
          ul.class-selector(v-if="course && course.classes" v-bind:style="{ left: `${leftPos}px`, width: `${theWidth}px` }")

            router-link.class-selector--item.released#intro-item(tag="li" v-bind:to="{ name: 'class', params: { classSlug: 'intro' } }")
              h1.class-selector--item--header
                icon(name="info")

            router-link.class-selector--item(tag="li" v-for="(theClass, index) in course.classes" v-bind:key="theClass.name" v-bind:class="{ [theClass.status.toLowerCase()]: true }" ref="class" v-bind:to="{ name: 'class', params: { classSlug: theClass.slug } }")
              h1.class-selector--item--header {{ theClass.title }}
              icon.status-indicator(name="check-circle" v-if="theClass.status === 'CURRENT'")
              icon.status-indicator(name="lock" v-if="theClass.status === 'FUTURE'")

            .clearfix
      
  .course-content-wrapper(v-if="course && currentClassSlug === 'intro'")

    .course-content-group
      //- ABOUT
      .course-content
        .course-content--header
          h1.content-title About the course

        .course-content--body
          markdown-renderer(v-if="course && course.baseUri" v-bind:markdown-url="infoMarkdown")

          four-corners-link(message="During this course you will use FourCorners to submit images as 'homework', this will allow you to add rich metadata to your images.")
        
        .course-content--footer
          .pure-button.pure-button-continue(@click="viewCurrentClass") Continue to class

</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';

import API from '@/api';
import VueScroll from 'vue-scroll';

import throttle from 'lodash/throttle';
import _get from 'lodash/get';

import MarkdownRenderer from '@/components/MarkdownRenderer';
import FourCornersLink from '@/components/fourcorners/FourCornersLink';
import JoinBanner from '@/components/banners/JoinBanner';

import 'vue-awesome/icons/angle-left';
import 'vue-awesome/icons/angle-right';
import 'vue-awesome/icons/info';
import 'vue-awesome/icons/check-circle';
import 'vue-awesome/icons/lock';

Vue.use(VueScroll);

export default {
  name: 'class-selector',
  components: {
    VueScroll,
    MarkdownRenderer,
    FourCornersLink,
    JoinBanner,
  },
  mounted() {
    this.windowResized(this);
    window.addEventListener("resize", () => {
      this.windowResized(this);
    }, { passive: true });
  },
  data() {
    return {
      offset: 0,
      remainingOffset: 0,
      leftPos: 0,
      introClass: {
        slug: 'intro',
      },
    };
  },
  computed: {
    ...mapGetters(['course', 'currentClass', 'isRegistered']),
    currentClassSlug() {
      return _get(this.currentClass, 'slug', 'intro')
    },
    infoMarkdown() {
      return `${this.course.baseUri}info.md`;
    },
    theWidth() {
      return ((this.course.classes.length) * 190.0) + 44
    },
    currentExists() {
      if (!(this.course && this.course.classes)) {
        return false;
      }
      for (const theClass of this.course.classes) {
        if (theClass.status === 'CURRENT') {
          return true;
        }
      }

      return false;
    },
  },
  methods: {
    windowResized: throttle(function(self) {
      if (!this.$refs.classselector) return
      this.offset = this.$refs.classselector.offsetLeft;
      this.remainingOffset = (this.$refs.classselector.scrollWidth - this.$refs.classselector.offsetWidth - this.$refs.classselector.offsetLeft);
    }, 200, { 'leading': false }),
    onScroll(e, position) {
      this.offset = position.scrollLeft;
      this.remainingOffset = (this.$refs.classselector.scrollWidth - this.$refs.classselector.offsetWidth - position.scrollLeft);
    },
    viewIntroClass() {
      this.$store.commit('SET_CURRENT_CLASS', this.introClass);
      this.$store.dispatch('resetState');
      this.$ga.event('class-selector', 'class-switched', 'class-intro');
    },
    viewCurrentClass() {
      if (!(this.course && this.course.classes)) {
        return false;
      }
      let currentExists = false
      for (const theClass of this.course.classes) {
        if (theClass.status === 'CURRENT') {
          currentExists = true
          this.$store.dispatch('getSpec', theClass.slug);
        }
      }
      if (!currentExists) this.$store.dispatch('getSpec', this.course.classes[0].slug);
    },
    scrollLeft() {
      this.$refs.classselector.scrollLeft -= 80;
    },
    scrollRight() {
      this.$refs.classselector.scrollLeft += 80;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/layout/course-content'
@import '~stylus/buttons'

$selector-height = 44px

.class-selector-wrapper
  radius(22px)
  height $selector-height
  margin 20px 0
  position relative
  @media(max-width: 800px)
    margin 20px 10px
  .skip-button
    animate()
    box-shadow()
    radius(50%)
    background-color white
    height $selector-height
    width $selector-height
    position absolute
    top 50%
    margin-top -($selector-height / 2)
    bottom 0
    z-index 1
    &:hover
      cursor pointer
    &.skip-button--left
      left 0px
    &.skip-button--right
      right 0px
    .fa-icon
      color $color-primary
      height 100%
      width 10px
      margin 0 18px
  .class-selector-container-wrapper
      radius(22px)
      height $selector-height
      overflow hidden
    .class-selector-container
      height ($selector-height + 20px)
      overflow-x scroll
      overflow-y hidden
      ul.class-selector
        cleanlist()
        height $selector-height
        white-space nowrap
        li.class-selector--item
          box-sizing()
          cleanlist()
          radius(22px)
          background-color darken($color-primary, 10%)
          border transparent 1px solid
          float left
          overflow hidden
          margin-left 10px
          padding 0 15px
          position relative
          text-align center
          height $selector-height
          width 180px
          white-space normal
          &#intro-item
            border none
            width 44px
            .fa-icon
              height 18px
              margin 14px 0
          &:first-child
            margin-left 0
          .status-indicator
            color $color-primary
            position absolute
            right 12px
            top 50%
            margin-top -8px
          h1.class-selector--item--header
            reset()
            color $color-primary
            font-size 1em
            font-weight normal
            line-height $selector-height
            text-align center

          /* Released styles */
          &.released
            background-color darken($color-primary, 10%)
            h1.class-selector--item--header, .status-indicator
              color white

          /* Current styles */
          &.current
            background-color darken($color-primary, 10%)
            h1.class-selector--item--header, .status-indicator
              color white

          /* Future styles */
          &.future
            background-color darken($color-primary, 10%)
            pointer-events none
            .status-indicator
              color $color-primary
            h1.class-selector--item--header
              $color-primary

          &:hover
            background-color darken($color-primary, 10%)
            cursor pointer

          &.router-link-active
            background-color white
            h1.class-selector--item--header, .status-indicator
              color $color-primary

.padded-container
  radius(22px)
  background-color white
  padding 30px 0
  text-align center
  width 100%
  h2
    reset()
    color $color-text-dark-grey
    line-height 40px
  .fa-icon
    height 40px

.course-content--footer
  border-top $color-border 1px solid
  text-align center
  .pure-button-continue
    margin 20px auto


</style>
