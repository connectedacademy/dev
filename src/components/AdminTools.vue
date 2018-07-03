<template lang="pug">
  #admin-tools(v-if="enabled")

    #editingstate(v-if="editingTranscript" @click="toggleEditTranscript")
      | Finished Editing?

    ul(v-if="!editingTranscript")
      li.tab(@click="toggleEditMode('audio')" :class="{ active: isActive('audio') }")
        | Audio
      // li.tab(@click="toggleEditMode('media')" :class="{ active: isActive('media') }")
        | Media
      li.tab(@click="toggleEditMode('transcript')" :class="{ active: isActive('transcript') }")
        | Transcript

    .tabs
      .tab-view(v-show="activeMode === 'audio'")
        .row
          h3 Introduction
          p Upload an introduction to the class below.
          .form
            input(ref="introAudioFile" type="file" name="upload")
            .clearfix
            .pure-button.pure-button-success(v-if="state.audio.introAudioFile === 'waiting'" @click="uploadFile('introAudioFile')") Upload
            .pure-button.pure-button-success(v-else) Uploading...
        .row
          h3 Main content
          p Upload the main audio file for the class.
          .form
            input(ref="mainAudioFile" type="file" name="upload")
            .clearfix
            .pure-button.pure-button-success(v-if="state.audio.mainAudioFile === 'waiting'" @click="uploadFile('mainAudioFile')") Upload
            .pure-button.pure-button-success(v-else) Uploading...
      
      .tab-view(v-show="activeMode === 'media'")
        h3 Manage media
        p Start adding, editing and removing images and videos that compliment the course.
        .clearfix
        .pure-button.pure-button-success(@click="") Manage

      .tab-view(v-show="activeMode === 'transcript'")
        .row
          h3 Download transcript
          p Once a transcript has completed processing, click below to download it.
          .pure-button.pure-button-success(v-if="state.transcript !== 'downloading'" @click="fetchTranscript") Download
          .pure-button.pure-button-success(v-else) Downloading...
        .row
          h3 Edit transcript
          p Enable edit mode to start making changes to the transcript.
          .pure-button.pure-button-success(@click="toggleEditTranscript") Start Editing
          
</template>

<script>
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'
import API from '@/api'

import _get from 'lodash/get'

export default {
  name: 'admin-tools',
  data() {
    return {
      activeMode: undefined,
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
      this.activeMode = (this.activeMode === mode) ? undefined : mode
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
    toggleEditTranscript () {
      this.$store.commit('TOGGLE_EDITING_TRANSCRIPT')
      this.activeMode = undefined
      if (!this.activeMode) {
        this.$store.commit('EDITING_SEGMENT', undefined)
      }
    },
    isActive(mode) {
      return this.activeMode === mode
    }
  },
  computed: {
    ...mapGetters(['user', 'editingTranscript']),
    enabled () {
      return _get(this.user, 'isAdmin', false)
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

$color-tools = lighten($color-primary, 10%)

#admin-tools
  background-color $color-tools

  #editingstate
    radius-top(10px)
    background-color $color-success
    box-sizing border-box
    color white
    font-weight bold
    line-height 20px
    padding 20px 40px
    position fixed
    text-align center
    z-index 999
    top auto
    bottom 0
    left 50%
    margin-left -160px
    width 320px
    
  ul
    reset()
    background-color $color-tools
    border-bottom alpha(black, 0.1) 1px solid
    padding 15px
    text-align center
    li.tab
      reset()
      animate()
      radius(6px)
      background-color $color-tools
      color white
      display inline-block
      font-weight bold
      font-size 0.9em
      line-height 40px
      margin 0px 5px
      padding 0 30px 0 30px
      &.form
        width calc(100% - 70px)
      &.active
        background-color darken($color-info, 10%)
      &:hover:not(.active)
        background-color darken($color-tools, 10%)
        cursor pointer
  .tabs
    // background-color darken($color-tools, 10%)
    .tab-view
      padding 20px
      h3, p
        reset()
        color white
      .pure-button
        margin-top 10px
        margin-right 10px
      .row:not(:last-child)
        margin-bottom 20px
      input[type="file"]
        color white
        padding 10px 0
</style>
