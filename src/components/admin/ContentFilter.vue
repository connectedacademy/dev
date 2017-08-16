<template lang="pug">

.content-filter(v-bind:class="{active: selectorVisible}")

    ul.content-filter--tags(@click="selectorVisible = !selectorVisible")
      li.content-filter--tag(v-if="filterClass") {{ classSlug }}
      li.content-filter--tag(v-if="filterContent") {{ contentSlug }}
      .clearfix

    .content-filter--selector(v-if="selectorVisible")
      select.full-width(v-model="classSlug" v-if="filterClass")
        option(disabled) Select class
        option(v-for="slug in classSlugs") {{ slug }}

      select.full-width(v-model="contentSlug" v-if="filterContent")
        option(disabled) Select content
        option(v-for="slug in contentSlugs") {{ slug }}

      .pure-button.pure-button-subtle.full-width.no-margin(@click="selectorVisible = false") Close

</template>

<script>
export default {
  name: 'content-filter',
  props: ['filterClass', 'filterContent'],
  watch: {
    classSlug(nV, oV) {
      if (nV !== oV) {
        this.$emit('update:classSlug', nV)
      }
    },
    contentSlug(nV, oV) {
      if (nV !== oV) {
        this.$emit('update:contentSlug', nV)
      }
    },
  },
  data() {
    return {
      selectorVisible: false,
      classSlugs: ['evidence', 'interpretation', 'fiction', 'fact', 'narrative'],
      contentSlugs: ['intro', 'liveclass', 'webinar', 'evidence', 'homework'],
      classSlug: 'evidence',
      contentSlug: 'intro',
    };
  },
};

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/admin'

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
    min-height 38px
    li.content-filter--tag
      cleanlist()
      radius(4px)
      background-color $color-primary
      color white
      float left
      margin 5px
      padding 3px 10px

  .content-filter--selector
    margin-top 10px
    select.full-width
      height 40px
      margin-bottom 10px
      width 100%
      outline 0

</style>
