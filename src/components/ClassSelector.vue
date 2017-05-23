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
        li.class-selector--item(v-for="(theClass, index) in course.classes" v-bind:key="theClass.name" @click="setCurrentClass(theClass.slug)" v-bind:class="{ [theClass.status.toLowerCase()]: true, active: (activeClass === theClass.slug) }")
          h1.class-selector--item--header {{ theClass.title }}
          h2.class-selector--item--body {{ theClass.description }}
          .class-selector--item--status-label {{ theClass.status }}
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
    };
  },
  methods: {
    onScroll(e, position) {
      this.offset = position.scrollLeft;
      this.remainingOffset = (this.$refs.classselector.scrollWidth - this.$refs.classselector.offsetWidth - position.scrollLeft);
    },
    setCurrentClass(newClass) {
      this.activeClass = newClass;
      this.$store.dispatch('getSpec', newClass);
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
  height 120px
  margin 10px 0
  overflow hidden
  position relative
  .skip-button
    radius(50%)
    background-color $color-primary
    height 40px
    width 40px
    position absolute
    top 50%
    margin-top -20px
    bottom 0
    z-index 1
    &:hover
      cursor pointer
    &.skip-button--left
      border-top-left-radius 0
      border-bottom-left-radius 0
      left -5px
    &.skip-button--right
      border-top-right-radius 0
      border-bottom-right-radius 0
      right -5px
    .fa-icon
      color white //$color-text-dark-grey
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
      height 120px
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
        height 120px
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
        h2.class-selector--item--body
          nomargin()
          nopadding()
          color $color-text-grey
          font-size 0.95em
          font-weight normal
          line-height 20px
          margin-top 5px
        .class-selector--item--status-label
          color $color-text-grey
          position absolute
          bottom 5px
          right 5px
          font-size 0.6em
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
