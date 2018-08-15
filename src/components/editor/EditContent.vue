<template lang="pug">
  .editable-section(:class="{ expanded: expanded }")
    .editable-header(@click="expanded = true")
      | {{ item.title }}
      ul.tags
        li.tag(:class="[item.type]") {{ item.type }}
        .clearfix
    .editable-content
      label Title
      input.full-width(v-model="item.title")
      label Description
      textarea.tall(v-model="item.description")
    .editable-controls
      .pure-button.pure-button-small.pure-button-success.subtle.pull-right(v-if="expanded" @click="update('content', index)") {{ updating ? 'Updating...' : 'Update' }}
      .pure-button.pure-button-small.pure-button-warning.subtle.pull-left(v-if="expanded" @click="expanded = false") Cancel
      .clearfix
</template>

<script>
import Editor from '@/mixins/Editor'

export default {
  name: 'edit-content',
  props: ['item', 'index'],
  mixins: [ Editor ]
}
</script>

<style lang="stylus" scoped>
@import '~stylus/editor'

ul.tags
  cleanlist()
  height 20px
  position absolute
  right 15px
  top 15px
  li.tag
    cleanlist()
    radius(10px)
    background-color $color-border
    color $color-text-grey
    float left
    font-size .7em
    line-height 20px
    padding 0 10px
    &.liveclass
      background-color $color-info
      color $color-white
</style>
