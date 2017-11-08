<template lang="pug">

ul.tag-list
  a(v-for="(tag, index) in tags" v-bind:key="index" v-bind:href="getLink(tag)" target="_blank" v-bind:style="{ 'pointer-events': (linked ? 'all' : 'none') }")
    li
      | {{ linked ? tag.label : tag }}
  .clearfix

</template>

<script>
import _get from 'lodash/get';

export default {
  name: 'tag-list',
  props: ['tags', 'linked'],
  methods: {
    getLink(tag) {
      return (this.linked) ? _get(tag, 'link') : '#';
    }
  }
}  
</script>

<style lang="stylus">

@import '~stylus/shared'

ul.tag-list
  cleanlist()
  display inline-block
  li
    cleanlist()
    radius(4px)
    background-color $color-info
    color white
    float left
    line-height 30px
    margin 5px
    padding 0 12px

</style>