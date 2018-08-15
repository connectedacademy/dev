<template lang="pug">
  .editable-section(:class="{ expanded: expanded }")
    .editable-header(@click="expanded = true")
      | Page Content
    .editable-content
      textarea.tall(v-model="markdown" placeholder="Page content")
    .editable-controls
      .pure-button.pure-button-small.pure-button-success.subtle.pull-right(v-if="expanded" @click="update('page')") {{ updating ? 'Updating...' : 'Update' }}
      .pure-button.pure-button-small.pure-button-warning.subtle.pull-left(v-if="expanded" @click="expanded = false") Cancel
      .clearfix
</template>

<script>
import { mapGetters } from 'vuex'
import Editor from '@/mixins/Editor'

export default {
  name: 'edit-page',
  props: ['page'],
  mixins: [ Editor ],
  mounted () {
    this.loadMarkdown(`${this.CDN}/${this.page.path}`)
  },
  data () {
    return {
      markdown: undefined
    }
  },
  computed: {
    ...mapGetters(['CDN'])
  }
}
</script>

<style lang="stylus" scoped>
@import '~stylus/editor'
</style>
