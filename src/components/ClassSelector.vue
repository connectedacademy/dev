<template lang="pug">

  .class-selector-wrapper
    .skip-button.hidden
    ul.class-selector
      li.class-selector--item(v-for="(theClass, index) in course.classes" v-bind:key="theClass.name" @click="setCurrentClass(theClass.slug)")
        h1.class-selector--item--header {{ theClass.title }}
        h2.class-selector--item--body {{ theClass.description }}
      .clearfix

</template>

<script>
import {mapGetters} from 'vuex';
import * as types from '@/store/mutation-types';

export default {
  name: 'class-selector',
  methods: {
    setCurrentClass(newClass) {
      this.$store.dispatch('getSpec', newClass);
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
  overflow-x scroll
  overflow-y hidden
  .skip-button
    background-color $color-primary
    height 120px
    width 40px
    position absolute
    top 0
    right 0
    border-top-right-radius 4px
    border-bottom-right-radius 4px
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
      border white 4px solid
      box-sizing border-box
      display inline-block
      overflow hidden
      margin-right 10px
      padding 10px 15px
      text-align left
      height 120px
      width 180px
      white-space normal
      animate()
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
      &:hover
        /*border-color $color-primary*/
        background-color #f2f2f2
        cursor pointer
      &.active
        background-color $color-primary
        border-color $color-primary
        h1.class-selector--item--header
          color white
        h2.class-selector--item--body
          color white

</style>
