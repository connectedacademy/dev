<template lang="pug">

  ul.class-selector
    li.class-selector--item(v-for="(theClass, index) in course.classes" v-bind:key="theClass.name" @click="setCurrentClass(index)")
      h1.class-selector--item--header {{ theClass.name }}
      h2.class-selector--item--body {{ theClass.description }}

</template>

<script>
import * as types from '../store/mutation-types';

export default {
  name: 'class-selector',
  methods: {
    setCurrentClass(newClass) {
      this.$store.commit(types.SET_CURRENT_CLASS, newClass);
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
    border white 4px solid
    margin 20px
    padding 15px
    width 160px
    animate()
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
    &:hover
      border-color $color-primary
      cursor pointer

</style>
