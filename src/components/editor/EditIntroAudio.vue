<template lang="pug">
.editable-section(:class="{ expanded: expanded }")
  .editable-header(@click="expanded = true")
    | Introductions
  .editable-content
    p Add a new introduction to the class
    .form
      input(ref="introAudioFile" type="file" name="upload")
      .clearfix
  .editable-controls
    .pure-button.pure-button-small.pure-button-success.subtle.pull-right(@click="uploadFile('introAudioFile')") {{ state.audio.introAudioFile === 'waiting' ? 'Upload' : 'Uploading...' }}
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
  },
  methods: {
    uploadFile (identifer) {
      const formData = new FormData()

      formData.append('theClass', this.$route.params.classSlug)
      formData.append('upload', this.$refs[identifer].files[0])
      formData.append('type', identifer)

      this.state.audio[identifer] = 'processing'
      
      API.course.uploadAudio(
        formData,
        (response) => {
          this.state.audio[identifer] = 'waiting'
        },
        (response) => {
          console.log(response)
          this.state.audio[identifer] = 'waiting'
        }
      )
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'
@import '~stylus/editor'

</style>
