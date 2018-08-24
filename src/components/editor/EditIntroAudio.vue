<template lang="pug">
.editable-section(:class="{ expanded: expanded }")
  .editable-header(@click="expanded = true")
    | Introductions
  .editable-content
    p Add a new introduction to the class
    .form
      input.full-width(v-model="audioDescription" ref="title" type="text" name="title" placeholder="Describe your audio")
      input.full-width(ref="introAudioFile" type="file" name="upload")
      .clearfix
  .editable-controls
    .pure-button.pure-button-small.pure-button-success.subtle.pull-right(@click="uploadAudioFile('introAudioFile')") {{ state.audio.introAudioFile === 'waiting' ? 'Upload' : 'Uploading...' }}
    .pure-button.pure-button-small.pure-button-warning.subtle.pure-button-warning.pull-left(@click="expanded = false") Cancel
    .clearfix  
</template>

<script>
import API from '@/api'
import Editor from '@/mixins/Editor'

export default {
  name: 'edit-intro-audio',
  mixins: [Editor],
  props: ['liveclass'],
  data() {
    return {
      state: {
        audio: {
          introAudioFile: 'waiting'
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
