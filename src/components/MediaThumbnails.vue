<template lang="pug">
  .md-thumbnail-row
    router-link(v-for="thumbnail in thumbnails" v-bind:to="thumbnail.link" v-bind:key="thumbnail.link")
      .md-thumbnail(v-bind:style="{ 'background-image': `url('${thumbnail.image}')` }")
        .md-thumbnail-caption {{ thumbnail.caption }}
    .clearfix
</template>

<script>
export default {
  name: 'media-thumbnails',
  props: ['thumbnails']
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.md-thumbnail-row
  height 120px
  margin 15px 0
  overflow-x scroll
  overflow-y hidden
  position relative
  white-space nowrap
  &::-webkit-scrollbar
    display none
  .md-thumbnail
    animate()
    background-image()
    box-sizing()
    display inline-block
    height 0
    margin 10px
    overflow hidden
    padding 5px
    padding-bottom 100px
    position relative
    white-space nowrap
    width 166px
    .md-thumbnail-caption
      animate()
      pinned()
      background-color alpha(black, 0.1)
      color white
      font-weight bold
      line-height 110px
      position absolute
      text-align center
    &:hover
      cursor pointer
      transform scale(1.1)
      .md-thumbnail-caption
        background-color alpha(black, 0.5)
        transform scale(1.3)

</style>
