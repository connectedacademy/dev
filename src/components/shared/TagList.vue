<template lang="pug">

ul.tag-list
  a(v-for="(val, tag) in tags" :key="index" v-if="val")
    li(v-text="tag")
  .clearfix

</template>

<script>
import _get from 'lodash/get';

export default {
  name: 'tag-list',
  props: ['tags']
}  
</script>

<style lang="stylus">

@import '~stylus/shared'

ul.tag-list
  cleanlist()
  margin 0 -5px 0 -5px
  li
    cleanlist()
    radius(15px)
    background-color $color-success
    color white
    float left
    line-height 30px
    margin 15px 5px 0 5px
    padding 0 15px

</style>