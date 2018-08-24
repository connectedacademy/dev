<template lang="pug">
.editable-section(:class="{ expanded: (editingMode == 'primary') }")
  .editable-header(@click="setEditingMode('primary')")
    | Primary Audio
  .editable-content
    p Replace primary audio for the class
    .form
      input.full-width(v-model="audioDescription" type="text" name="title" placeholder="Describe your audio")
      input.full-width(ref="mainAudioFile" type="file" name="upload")
      .clearfix
  .editable-controls
    .pure-button.pure-button-small.pure-button-success.subtle.pull-right(@click="uploadAudioFile('mainAudioFile')") {{ state.audio.mainAudioFile === 'waiting' ? 'Upload' : 'Uploading...' }}
    .pure-button.pure-button-small.pure-button-warning.subtle.pull-left(@click="setEditingMode(undefined)") Cancel
    .clearfix  
</template>

<script>
import API from '@/api'
import Editor from '@/mixins/Editor'

export default {
  name: 'edit-primary-audio',
  mixins: [Editor],
  props: ['liveclass'],
  data() {
    return {
      state: {
        audio: {
          mainAudioFile: 'waiting'
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'
@import '~stylus/editor'

</style>
