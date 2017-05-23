<template lang="pug">

  .class-selector-wrapper
    transition(name="fade")
      .skip-button.skip-button--left(@click="scrollLeft" v-if="leftArrowVisible")
        icon(name="angle-left")
    transition(name="fade")
      .skip-button.skip-button--right(@click="scrollRight" v-if="rightArrowVisible")
        icon(name="angle-right")
    .class-selector-container(ref="classselector")
      ul.class-selector
        li.class-selector--item(v-for="(theClass, index) in course.classes" v-bind:key="theClass.name" @click="setCurrentClass(theClass.slug)" v-bind:class="{ [theClass.status.toLowerCase()]: true, active: (activeClass === theClass.slug) }")
          h1.class-selector--item--header {{ theClass.title }}
          h2.class-selector--item--body {{ theClass.description }}
          .class-selector--item--status-label {{ theClass.status }}
        .clearfix

</template>

<script>
import {mapGetters} from 'vuex';
import * as types from '@/store/mutation-types';

export default {
  name: 'class-selector',
  watch: {
    leftOffset() {
      const offset = (this.leftOffset < 100) ? 0 : this.leftOffset;
      this.leftArrowVisible = (offset > 100);
      this.rightArrowVisible = (offset < (this.$refs.classselector.scrollWidth - this.$refs.classselector.offsetWidth));

      this.$refs.classselector.scrollLeft = offset;
    },
    currentClass() {
      this.activeClass = this.currentClass.slug;
    },
  },
  data() {
    return {
      activeClass: undefined,
      leftOffset: 0,
      leftArrowVisible: false,
      rightArrowVisible: true,
    };
  },
  methods: {
    setCurrentClass(newClass) {
      this.activeClass = newClass;
      this.$store.dispatch('getSpec', newClass);
    },
    scrollLeft() {
      this.leftOffset = this.$refs.classselector.scrollLeft -= 80;
    },
    scrollRight() {
      this.leftOffset = this.$refs.classselector.scrollLeft += 80;
    },
  },
  computed: {
    ...mapGetters([
      'course', 'currentClass'
    ]),
  },
};
</script>

<style lang="stylus" scoped>

@import '../assets/stylus/shared/*'

.class-selector-wrapper
  radius(4px)
  height 120px
  margin-bottom 10px
  overflow hidden
  position relative
  .skip-button
    background-color #f2f2f2
    height 100%
    width 40px
    position absolute
    top 0
    bottom 0
    z-index 1
    &:hover
      cursor pointer
    &.skip-button--left
      border-top-left-radius 4px
      border-bottom-left-radius 4px
      left 0
    &.skip-button--right
      border-top-right-radius 4px
      border-bottom-right-radius 4px
      right 0
    .fa-icon
      color $color-text-dark-grey
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
      width calc(200px * 2)
      li.class-selector--item
        cleanlist()
        radius(4px)
        background-color white
        box-sizing border-box
        display inline-block
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
