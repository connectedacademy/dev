<template lang="pug">

  .class-selector-wrapper(v-bind:class="{ 'hidden': !visible }")
    ul.class-selector
      li.class-selector--item(v-for="(theClass, index) in course.classes" v-bind:key="theClass.name" @click="setCurrentClass(theClass.slug)")
        h1.class-selector--item--header {{ theClass.title }}
        h2.class-selector--item--body {{ theClass.description }}
      .clearfix

</template>

<script>
import * as types from '@/store/mutation-types';

export default {
  name: 'class-selector',
  props: ['isVisible'],
  methods: {
    setCurrentClass(newClass) {
      this.$store.dispatch('getSpec', newClass);
    },
  },
  computed: {
    visible() {
      return this.isVisible;
    },
    course() {
      return this.$store.getters.course;
    },
    currentClass() {
      return this.$store.getters.currentClass;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '../assets/stylus/shared/*'

.class-selector-wrapper
  background-color $color-light-grey
  height 160px
  overflow-x scroll
  overflow-y hidden
  ul.class-selector
    cleanlist()
    border-bottom #e1e1e1 1px solid
    height 160px
    padding 10px
    white-space nowrap
    width calc(200px * 2)
    li.class-selector--item
      cleanlist()
      background-color white
      border white 4px solid
      box-sizing border-box
      display inline-block
      overflow hidden
      margin 10px
      padding 15px
      text-align left
      height 120px
      width 180px
      white-space normal
      animate()
      h1.class-selector--item--header
        nomargin()
        nopadding()
        color $color-text-dark-grey
        font-size 1.05em
      h2.class-selector--item--body
        nomargin()
        nopadding()
        color $color-text-grey
        font-size 0.95em
        font-weight normal
        margin-top 5px
      &:hover
        border-color $color-primary
        cursor pointer
</style>
