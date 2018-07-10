<template lang="pug">
  #admin-tools(v-if="enabled")

    .tab-selector
      ul
        li.tab(@click="toggleEditMode('intro')" :class="{ active: isActive('intro') }")
          | Introductions
        li.tab(@click="toggleEditMode('audio')" :class="{ active: isActive('audio') }")
          | Primary Audio
        // li.tab(@click="toggleEditMode('media')" :class="{ active: isActive('media') }")
          | Media
        li.tab(@click="toggleEditMode('other')" :class="{ active: isActive('other') }")
          | Transcript

    .tabs
      .tab-view(v-show="editingMode === 'intro'")
        .inner-wrapper
          .row
            h3 Upload audio
            p Add a new introduction to the class
            .form
              input(ref="introAudioFile" type="file" name="upload")
              // br
              // input(ref="introTitle" type="text" name="introtitle" placeholder="Enter title")
              .clearfix
              .pure-button.pure-button-success(v-if="state.audio.introAudioFile === 'waiting'" @click="uploadFile('introAudioFile')") Upload
              .pure-button.pure-button-success(v-else) Uploading...

      .tab-view(v-show="editingMode === 'media'")
        .inner-wrapper
          h3 Manage media
          p Start adding, editing and removing images and videos that compliment the course.
          .clearfix
          .pure-button.pure-button-success(@click="") Manage

      .tab-view(v-show="editingMode === 'audio'")
        .inner-wrapper
          .row
            h3 Upload audio
            p Replace the existing audio for the class
            .form
              input(ref="mainAudioFile" type="file" name="upload")
              .clearfix
              .pure-button.pure-button-success(v-if="state.audio.mainAudioFile === 'waiting'" @click="uploadFile('mainAudioFile')") Upload
              .pure-button.pure-button-success(v-else) Uploading...
      
      .tab-view(v-show="editingMode === 'other'")
        .inner-wrapper
          .row
            h3 Fetch transcript
            p Once the transcript has completed processing, click below to download
            .pure-button.pure-button-success(v-if="state.transcript !== 'downloading'" @click="fetchTranscript") Download
            .pure-button.pure-button-success(v-else) Downloading...
          .row
            h3 Edit transcript
            p Enable edit mode to start making changes to the transcript
            .pure-button.pure-button-warning(@click="toggleEditingTranscript") Start Editing
          
</template>

<script>
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'
import API from '@/api'

import _get from 'lodash/get'

export default {
  name: 'admin-tools',
  props: ['liveclass'],
  data() {
    return {
      state: {
        audio: {
          introAudioFile: 'waiting',
          mainAudioFile: 'waiting'
        },
        transcript: 'waiting'
      }
    }
  },
  methods: {
    toggleEditMode (mode) {
      this.$store.commit('EDITING_MODE', mode)
    },
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
    },
    fetchTranscript () {
      this.state.transcript = 'downloading'
      
      API.course.fetchTranscript(
        this.$route.params.classSlug,
        (response) => {
          console.log(response)
          this.state.transcript = 'waiting'
          EventBus.$emit('transcriptUpdated')
        },
        (response) => {
          this.state.transcript = 'failed'
          console.log(response)
        }
      )
    },
    toggleEditingTranscript () {
      this.$store.commit('EDITING_MODE', 'transcript')
      this.$store.commit('EDITING_SEGMENT', undefined)
    },
    isActive(mode) {
      return this.editingMode === mode
    }
  },
  computed: {
    ...mapGetters(['user', 'editingMode']),
    enabled () {
      return _get(this.user, 'isAdmin', false)
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

#admin-tools
  background-color $color-tools
  
  .tab-selector
    height 60px
    overflow hidden
    ul
      reset()
      background-color darken($color-tools, 10%)
      // border-bottom alpha(black, 0.1) 1px solid
      height 80px
      overflow-x scroll
      white-space nowrap
      li.tab
        reset()
        animate()
        // background-color $color-tools
        background-color darken($color-tools, 10%)
        color white
        display inline-block
        font-weight bold
        font-size 0.9em
        line-height 60px
        margin 0
        padding 0 40px
        &.form
          width calc(100% - 70px)
        &.active
          background-color $color-tools
          // border-bottom-color darken($color-info, 10%)
        &:hover:not(.active)
          background-color darken($color-tools, 5%)
          cursor pointer

  .tabs
    .tab-view
      .inner-wrapper
        padding 20px
      h3, p
        reset()
        color white
      .pure-button
        margin-top 10px
        margin-right 10px
      .row:not(:last-child)
        margin-bottom 20px
      input[type="file"], select
        color white
        margin 10px 0
</style>
