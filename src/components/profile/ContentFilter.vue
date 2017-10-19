<template lang="pug">

.content-filter

    .content-filter--selector
      select.full-width(v-model="contentSlug" v-if="filterContent")
        option(disabled) Select content
        option(v-for="slug in contentSlugs") {{ slug }}

</template>

<script>
import { mapGetters } from 'vuex';
import map from 'lodash/map';

export default {
  name: 'content-filter',
  props: ['filterClass', 'filterContent'],
  watch: {
    contentSlug(nV, oV) {
      if (nV !== oV) {
        this.$emit('update:contentSlug', nV)
      }
    },
  },
  data() {
    return {
      contentSlug: undefined,
    };
  },
  computed: {
    ...mapGetters(['course']),
    contentSlugs() {
      return map(this.course.classes, (o) => {
        return o.slug;
      });
    }
  }
};

</script>

<style lang="stylus" scoped>

@import '~stylus/profile'

.content-filter
  animate()
  background-color white
  border-bottom $color-border 1px solid
  border-top $color-border 1px solid
  color $color-text-dark-grey
  padding 10px
  &.active
    background-color $color-lightest-grey

  ul.content-filter--tags
    cleanlist()
    cursor pointer
    margin -5px
    min-height 38px
    li.content-filter--tag
      cleanlist()
      border-box()
      radius(4px)
      background-color $color-primary
      color white
      float left
      line-height 40px
      margin 5px
      padding 0 10px
      width 100%

  .content-filter--selector
    select.full-width
      box-sizing()
      height 40px
      width 100%
      outline 0

</style>
