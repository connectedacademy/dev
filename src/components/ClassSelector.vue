<template lang="pug">

  .class-selector-wrapper
    transition(name="fade")
      .skip-button.skip-button--left(@click="scrollLeft" v-if="offset > 0")
        icon(name="angle-left")
    transition(name="fade")
      .skip-button.skip-button--right(@click="scrollRight" v-if="remainingOffset > 0")
        icon(name="angle-right")
    .class-selector-container(ref="classselector" v-scroll="onScroll")
      ul.class-selector(v-bind:style="{ left: `${leftPos}px`, width: `${theWidth}px` }")
        li.class-selector--item.released(@click="setCurrentClass(introClass)" v-bind:class="{ active: (activeClass === 'course_intro') }")
          h1.class-selector--item--header Introduction
        li.class-selector--item(v-for="(theClass, index) in course.classes" v-bind:key="theClass.name" @click="setCurrentClass(theClass.slug)" v-bind:class="{ [theClass.status.toLowerCase()]: true, active: (activeClass === theClass.slug) }")
          h1.class-selector--item--header {{ theClass.title }}
        .clearfix

</template>

<script>
import {mapGetters} from 'vuex';
import * as types from '@/store/mutation-types';
import VueScroll from 'vue-scroll';

export default {
  name: 'class-selector',
  watch: {
    currentClass() {
      this.activeClass = this.currentClass.slug;
    },
  },
  data() {
    return {
      activeClass: undefined,
      offset: 0,
      remainingOffset: 1,
      leftPos: 0,
      introClass: {
        slug: 'course_intro',
      },
    };
  },
  methods: {
    onScroll(e, position) {
      this.offset = position.scrollLeft;
      this.remainingOffset = (this.$refs.classselector.scrollWidth - this.$refs.classselector.offsetWidth - position.scrollLeft);
    },
    setCurrentClass(newClass) {
      this.$store.dispatch('resetState');
      this.activeClass = newClass;
      if (newClass.slug === 'course_intro') {
        this.$store.commit(types.SET_CURRENT_CLASS, newClass);
      } else {
        this.$store.dispatch('getSpec', newClass);
      }
    },
    scrollLeft() {
      this.$refs.classselector.scrollLeft -= 80;
    },
    scrollRight() {
      this.$refs.classselector.scrollLeft += 80;
    },
  },
  computed: {
    ...mapGetters([
      'course', 'currentClass'
    ]),
    theWidth() {
      return (this.course && this.course.classes) ? ((this.course.classes.length * 190.0) - 10) : 0;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '../assets/stylus/shared/*'

.class-selector-wrapper
  radius(4px)
  height 44px
  margin 10px 0
  overflow hidden
  position relative
  .skip-button
    background-color $color-primary
    height 44px
    width 44px
    position absolute
    top 50%
    margin-top -22px
    bottom 0
    z-index 1
    &:hover
      cursor pointer
    &.skip-button--left
      left 0px
    &.skip-button--right
      right 0px
    .fa-icon
      color white
      height 100%
      width 10px
      margin 0 15px
  .class-selector-container
    height 140px
    overflow-x scroll
    overflow-y hidden
    ul.class-selector
      cleanlist()
      border-bottom #e1e1e1 1px solid
      height 44px
      white-space nowrap
      li.class-selector--item
        cleanlist()
        radius(4px)
        background-color white
        box-sizing border-box
        float left
        overflow hidden
        margin-left 10px
        padding 10px 15px
        position relative
        text-align left
        height 44px
        width 180px
        white-space normal
        animate()
        &:first-child
          margin-left 0
        h1.class-selector--item--header
          nomargin()
          nopadding()
          color $color-text-dark-grey
          font-size 1em
          line-height 25px
          text-align center
        &:hover
          background-color #f2f2f2
          cursor pointer

        /* Released styles */
        &.released
          background-color white

        /* Current styles */
        &.current
          background-color white

        /* Future styles */
        &.future
          opacity 0.8
          pointer-events none
          /*h1.class-selector--item--header
            color $color-text-grey*/

        &.active
          background-color $color-primary
          h1.class-selector--item--header, h2.class-selector--item--body, .class-selector--item--status-label
            color white

</style>
