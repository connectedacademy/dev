<template lang="pug">
  .editable-section(:class="{ expanded: expanded }")
    .editable-header(@click="expanded = true")
      | Manage Course
    .editable-content
      span.editable-property(v-for="(property, index) in properties")
        label {{ property.label }}
        input.full-width(v-if="property.type === 'text'" v-model="property.value")
    .editable-controls
      .pure-button.pure-button-small.pure-button-success.subtle.pull-right(v-if="expanded" @click="update('course')") {{ updating ? 'Updating...' : 'Update' }}
      .pure-button.pure-button-small.pure-button-warning.subtle.pull-left(v-if="expanded" @click="expanded = false") Cancel
      .clearfix
</template>

<script>
import { mapGetters } from 'vuex'

import Editor from '@/mixins/Editor'

export default {
  name: 'edit-content',
  mixins: [ Editor ],
  data() {
    return {
      properties: {
        title: {
          label: 'Course Title',
          type: 'text',
          value: undefined
        },
        hashtag: {
          label: 'Course Hashtag',
          type: 'text',
          value: undefined
        },
        image: {
          label: 'Course Image',
          type: 'text',
          value: undefined
        },
        imagecredit: {
          label: 'Image Credit',
          type: 'text',
          value: undefined
        }
      }
    }
  },
  computed: {
    ...mapGetters(['course'])
  },
  mounted() {
    this.loadProperties(this.course)
  },
  methods: {

  }
}
</script>

<style lang="stylus" scoped>
@import '~stylus/editor'
</style>
