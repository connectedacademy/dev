<template lang="pug">

.class-selector

  .class-selector-wrapper(v-show="activeClass && course && course.classes")
    transition(name="fade")
      .skip-button.skip-button--left(@click="scrollLeft" v-if="offset > 0")
        icon(name="angle-left")
    transition(name="fade")
      .skip-button.skip-button--right(@click="scrollRight" v-if="remainingOffset > 0")
        icon(name="angle-right")
    .class-selector-container(ref="classselector" v-scroll="onScroll")
      ul.class-selector(v-if="course && course.classes" v-bind:style="{ left: `${leftPos}px`, width: `${theWidth}px` }")

        li.class-selector--item.released#intro-item(@click="viewIntroClass()" v-bind:class="{ active: (activeClass === 'intro') }")
          h1.class-selector--item--header
            icon(name="info")

        li.class-selector--item(v-for="(theClass, index) in course.classes" v-bind:key="theClass.name" @click="setCurrentClass(theClass.slug)" v-bind:class="{ [theClass.status.toLowerCase()]: true, active: (activeClass === theClass.slug) }" ref="class")
          h1.class-selector--item--header {{ theClass.title }}
          icon.status-indicator(name="check-circle" v-if="theClass.status === 'CURRENT'")
          icon.status-indicator(name="lock" v-if="theClass.status === 'FUTURE'")

        .clearfix


    .loading-wrapper(v-for="n in 5")
      .padded-container.mock-container(v-bind:style="{ height: `${(5 - n) * 50}px` }")
//- 
  .padded-container(v-if="!currentExists && currentClass && !currentClass.loading")
    h2 This course has finished
  .padded-container(v-if="currentClass && currentClass.status === 'RELEASED' && currentExists")
    h2 This is not the current class
    .pure-button.pure-button-primary(@click="viewCurrentClass") {{ $t('course.view_current_class') }}

</template>

<script>
import {mapGetters} from 'vuex';
import * as types from '@/store/mutation-types';
import VueScroll from 'vue-scroll';
import API from '@/api';

export default {
  name: 'class-selector',
  mounted() {
    if (this.currentClass) {
      this.activeClass = this.currentClass.slug;
      return;
    }
    this.viewIntroClass();

  },
  watch: {
    currentClass(nV, oV) {
      this.activeClass = nV.slug;
      this.$router.replace(`/course/${nV.slug}`);
    },
  },
  data() {
    return {
      activeClass: undefined,
      offset: 0,
      remainingOffset: 1,
      leftPos: 0,
      introClass: {
        slug: 'intro',
      },
    };
  },
  methods: {
    onScroll(e, position) {
      this.offset = position.scrollLeft;
      this.remainingOffset = (this.$refs.classselector.scrollWidth - this.$refs.classselector.offsetWidth - position.scrollLeft);
    },
    setInitalClass() {
      if (this.isRegistered) {
        this.viewCurrentClass();
      } else {
        this.viewIntroClass();
      }
    },
    viewIntroClass() {
      this.$ga.event('class-selector', 'click', 'class-switched', 'class-intro');
      this.$store.dispatch('resetState');
      this.$store.commit(types.SET_CURRENT_CLASS, this.introClass);
    },
    viewCurrentClass() {
      if (!this.currentExists) {
        this.viewIntroClass();
      }
      if (!(this.course && this.course.classes)) {
        return false;
      }
      for (const theClass of this.course.classes) {
        if (theClass.status === 'CURRENT') {
          this.$store.dispatch('getSpec', theClass.slug);
        }
      }
    },
    setCurrentClass(newClass) {
      this.$ga.event('class-selector', 'click', 'class-switched', newClass);

      let self = this;
      this.$store.dispatch('resetState').then(function() {
        if (newClass === undefined) {
          self.setInitalClass();
        } else {
          self.activeClass = newClass;
          self.$store.dispatch('getSpec', newClass);
        }
      });
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
      'course', 'currentClass', 'isRegistered'
    ]),
    theWidth() {
      return (this.course && this.course.classes) ? (((this.course.classes.length) * 190.0) - 10) + 190.0 : 190.0;
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
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

$selector-height = 44px

.class-selector-wrapper
  radius(22px)
  height $selector-height
  margin 0 0 20px 0
  overflow hidden
  position relative
  @media(max-width: 800px)
    margin 0 10px 20px 10px
  .skip-button
    radius(22px)
    background-color alpha(white, 0.5)
    height $selector-height
    width $selector-height
    position absolute
    top 50%
    margin-top -($selector-height / 2)
    bottom 0
    z-index 1
    &:hover
      background-color white
      cursor pointer
    &.skip-button--left
      left 0px
      border-right $color-primary 1px solid
    &.skip-button--right
      right 0px
      border-left $color-primary 1px solid
    .fa-icon
      color $color-primary
      height 100%
      width 10px
      margin 0 18px
  .class-selector-container
    radius(22px)
    height 140px
    overflow-x scroll
    overflow-y hidden
    ul.class-selector
      cleanlist()
      border-bottom #e1e1e1 1px solid
      height $selector-height
      white-space nowrap
      li.class-selector--item
        cleanlist()
        animate()
        radius(22px)
        background-color alpha(black, 0.1)
        border transparent 1px solid
        box-sizing()
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
          background-color alpha(black, 0.1)
          h1.class-selector--item--header, .status-indicator
            color white

        /* Current styles */
        &.current
          background-color alpha(black, 0.1)
          h1.class-selector--item--header, .status-indicator
            color white

        /* Future styles */
        &.future
          background-color alpha(white, 0.3)
          pointer-events none
          .status-indicator
            color $color-primary
          h1.class-selector--item--header
            $color-primary

        &:hover
          background-color darken($color-primary, 10%)
          cursor pointer

        &.active
          background-color white
          transition none
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
    color $color-purple
    height 40px
  .pure-button
    margin-top 20px

.padded-container.mock-container
  background-color rgba(255,255,255, 0.1)
  margin-bottom 10px


</style>
