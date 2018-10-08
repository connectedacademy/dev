<template lang="pug">

  #media-upload-modal(v-bind:class="{ visible: mediaUploadModalVisible }")
    #media-upload-modal--container
      p {{ `Choose an image file then click upload to add it to this segment (${mediaUploadModal.segment})` }}
      form
        input(ref="mediaUpload" type="file" name="upload")
      br
      button.pure-button.pure-button-warning(v-if="state === 'waiting'" v-on:click="closeModal") Cancel

      button.pure-button.pure-button-danger(v-if="state === 'waiting'" @click="removeMedia") Remove
      button.pure-button.pure-button-success(v-else-if="state === 'removing'") Removing...

      button.pure-button.pure-button-success(v-if="state === 'waiting'" @click="uploadFile") Upload
      button.pure-button.pure-button-success(v-else-if="state === 'uploading'") Uploading...
    
</template>

<script>
import API from '@/api'
import { Events } from '@/events.js'
import { mapGetters } from 'vuex'

export default {
  name: 'media-upload-modal',
  data() {
    return {
      state: 'waiting'
    }
  },
  computed: {
    ...mapGetters(['mediaUploadModal', 'mediaUploadModalVisible']),
  },
  methods: {
    closeModal() {
      this.$store.commit('DISMISS_MEDIA_UPLOAD_MODAL')
    },
    removeMedia () {
      const formData = new FormData()

      formData.append('theClass', this.$route.params.classSlug)
      formData.append('theSegment', this.mediaUploadModal.segment)

      this.state = 'removing'
      
      API.course.removedMedia(
        formData,
        (response) => {
          this.state = 'waiting'
          Events.$emit('mediaUpdated')
          this.$store.commit('DISMISS_MEDIA_UPLOAD_MODAL')
        },
        (response) => {
          console.log(response)
          this.state = 'waiting'
        }
      )
    },
    uploadFile () {
      const formData = new FormData()

      formData.append('theClass', this.$route.params.classSlug)
      formData.append('theSegment', this.mediaUploadModal.segment)
      formData.append('upload', this.$refs.mediaUpload.files[0])

      this.state = 'uploading'
      
      API.course.uploadMedia(
        formData,
        (response) => {
          this.state = 'waiting'
          Events.$emit('mediaUpdated')
          this.$store.commit('DISMISS_MEDIA_UPLOAD_MODAL')
        },
        (response) => {
          console.log(response)
          this.state = 'waiting'
        }
      )
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

#media-upload-modal
  animate()
  display block
  max-width 320px
  position fixed
  z-index 57
  top 120px
  left 50%
  margin-left -160px
  opacity 0
  pointer-events none
  &.visible
    top 80px
    opacity 1
    pointer-events all
  #media-upload-modal--header
    height 40px
    line-height 40px
    text-align center
    h1
      reset()
      color white
      font-size 1.2em
  #media-upload-modal--container
    radius(12px)
    background-color white
    padding 20px 30px
    text-align center
    p
      margin 0 0 20px 0
    button
      font-size 0.9em
      margin 0 5px
      padding 5px 10px

</style>
