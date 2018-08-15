<template lang="pug">
  .editable-section(:class="{ expanded: expanded }")
    .editable-header(@click="expanded = true")
      | {{ item.title }}
    .editable-content
      span.editable-property(v-for="(property, index) in properties")
        label {{ property.label }}
        input.full-width(v-if="property.type === 'text'" v-model="property.value")
    .editable-controls
      .pure-button.pure-button-small.pure-button-success.subtle.pull-right(@click="update('schedule', index)") {{ updating ? 'Updating...' : 'Update' }}
      .pure-button.pure-button-small.pure-button-warning.subtle.pull-left(v-if="expanded" @click="expanded = false") Cancel
      .clearfix
</template>

<script>
import Editor from '@/mixins/Editor'

export default {
  name: 'edit-schedule',
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
        },
        slug: {
          label: 'Slug',
          type: 'text',
          value: undefined
        },
        date: {
          label: 'Date',
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
</style>
