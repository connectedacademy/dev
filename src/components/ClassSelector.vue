<template lang="pug">

.class-selector
  .class-selector-wrapper(v-show="activeClass")
    transition(name="fade")
      .skip-button.skip-button--left(@click="scrollLeft" v-if="offset > 0")
        icon(name="angle-left")
    transition(name="fade")
      .skip-button.skip-button--right(@click="scrollRight" v-if="remainingOffset > 0")
        icon(name="angle-right")
    .class-selector-container(ref="classselector" v-scroll="onScroll")
      ul.class-selector(v-if="course && course.classes" v-bind:style="{ left: `${leftPos}px`, width: `${theWidth}px` }")
        li.class-selector--item.released(@click="viewIntroClass()" v-bind:class="{ active: (activeClass === 'intro') }")
          h1.class-selector--item--header Introduction
        li.class-selector--item(v-for="(theClass, index) in course.classes" v-bind:key="theClass.name" @click="setCurrentClass(theClass.slug)" v-bind:class="{ [theClass.status.toLowerCase()]: true, active: (activeClass === theClass.slug) }")
          h1.class-selector--item--header {{ theClass.title }}
          icon.status-indicator(name="check-circle" v-if="theClass.status === 'CURRENT'")
          icon.status-indicator(name="clock-o" v-if="theClass.status === 'FUTURE'")
        .clearfix

  .padded-container(v-if="currentClass && currentClass.loading")
    icon(name="refresh" scale="2" spin)

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
    API.auth.checkAuth(
      response => {
        if (response.user) {
          this.viewCurrentClass();
        } else {
          this.viewIntroClass();
        }
      },
      response => {
        this.viewIntroClass();
      },
    );
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
      return (this.course && this.course.classes) ? ((this.course.classes.length * 190.0) - 10) : 0;
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

@import '../assets/stylus/shared/*'

.class-selector-wrapper
  radius(4px)
  height 44px
  margin 0 0 10px 0
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
      border-right darken($color-primary, 10%) 3px solid
    &.skip-button--right
      right 0px
      border-left darken($color-primary, 10%) 3px solid
    .fa-icon
      color white
      height 100%
      width 10px
      margin 0 15px
  .class-selector-container
    radius(6px)
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
        text-align center
        height 44px
        width 180px
        white-space normal
        animate()
        &:first-child
          margin-left 0
        .status-indicator
          color $color-primary
          position absolute
          left 5px
          top 5px
        h1.class-selector--item--header
          nomargin()
          nopadding()
          color $color-text-dark-grey
          font-size 1em
          line-height 26px
          text-align center

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
          .status-indicator
            color $color-light-grey

        &:hover
          background-color darken(white, 20%)
          cursor pointer

        &.active
          background-color $color-primary
          h1.class-selector--item--header, .status-indicator
            color white

.padded-container
  radius(4px)
  background-color white
  padding 30px 0
  text-align center
  width 100%
  h2
    nomargin()
    nopadding()
    color $color-text-dark-grey
    line-height 40px
  .fa-icon
    color $color-purple
    height 40px
  .pure-button
    margin-top 20px

</style>
