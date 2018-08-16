<template lang="pug">
  .editable-section(:class="{ expanded: expanded }")
    .editable-header(@click="expanded = true")
      | {{ item.title }}
      ul.tags
        li.tag(:class="[item.type]") {{ item.type }}
        .clearfix
    .editable-content
      span.editable-property(v-for="(property, index) in properties")
        label {{ property.label }}
        input.full-width(v-if="property.type === 'text'" v-model="property.value")
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
  mixins: [ Editor ],
  data() {
    return {
      properties: {
        title: {
          label: 'Title',
          type: 'text',
          value: undefined
        },
        description: {
          label: 'Description',
          type: 'text',
          value: undefined
        }
      }
    }
  },
  mounted() {
    this.loadProperties(this.item)
  }
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
