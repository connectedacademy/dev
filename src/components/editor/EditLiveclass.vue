<template lang="pug">
  #admin-tools

    edit-intro-audio
    edit-primary-audio

    .editable-section(v-for="(mode, key) in editModes" :class="{ expanded: (editingMode === key) }")
      .editable-header(@click="setEditMode(key)" v-text="key")
      .editable-content
        p {{ mode }}
      .editable-controls
        .pure-button.pure-button-small.pure-button-success.subtle.pull-right(@click="setEditMode(key)") Done
        .clearfix
          
</template>

<script>
import { mapGetters } from 'vuex'
import { Events } from '@/events.js'
import API from '@/api'

import EditIntroAudio from '@/components/editor/EditIntroAudio'
import EditPrimaryAudio from '@/components/editor/EditPrimaryAudio'
import Editor from '@/mixins/Editor'

import _get from 'lodash/get'

export default {
  name: 'admin-tools',
  components: {
    EditIntroAudio,
    EditPrimaryAudio
  },
  mixins: [Editor],
  props: ['liveclass'],
  data() {
    return {
      editModes: {
        media: 'Start making edits to the media inline, when you have finished click \'Done\'.',
        transcript: 'Start making edits to the transcript inline, when you have finished click \'Done\'.',
        prompts: 'Start making edits to the prompts inline, when you have finished click \'Done\'.'
      }
    }
  },
  computed: {
    ...mapGetters(['editingMode']),
    enabled () {
      return _get(this.user, 'isAdmin', false)
    }
  },
  methods: {
    finishEditing () {
      switch (this.editingMode) {
        case 'prompts':
          // Pull new prompts
          Events.$emit('promptsUpdated')
          break
        case 'transcript':
          // Pull new transcript
          Events.$emit('transcriptUpdated')
          break
        case 'media':
          // Pull new media
          Events.$emit('mediaUpdated')
          break
      }
      this.$store.commit('IS_EDITING', false)
      this.$store.commit('EDITING_MODE', undefined)
      this.$store.commit('EDITING_SEGMENT', undefined)
    },
    setEditMode (mode) {
      if (mode === this.editingMode) {
        this.finishEditing()
      } else {
        this.$store.commit('IS_EDITING', true)
        this.$store.commit('EDITING_MODE', mode)
        this.$store.commit('EDITING_SEGMENT', undefined)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'
@import '~stylus/editor'

.edit-control
  .edit-button
    radius(6px)
    color $color-text-grey
    font-weight bold
    margin-top 20px
    padding 15px
    text-align left
    &:hover
      background-color $color-lightest-grey
      cursor pointer
    &.editing
      background-color $color-success
      color white
      text-align center
      &:hover
        background-color darken($color-success, 5%)
</style>
