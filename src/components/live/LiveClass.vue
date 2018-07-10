<template lang="pug">

.course-content#liveclass(name="section-liveclass" v-if="liveClass")
  
  .course-content--header.block
    #adminAction(v-if="isAdmin" @click="toggleAdminTools")
      i.fas.fa-wrench.fa-lg
    #engineType
      i.fab.fa-twitter.fa-lg(v-if="course.engine === 'twitter'" title="Messages are published on Twitter")
      i.fas.fa-comment.fa-lg(v-if="course.engine === 'local'" title="Messages are stored on Connected Academy")
    h1.content-title
      | {{ liveClass.title }}
    p.content-description(v-if="liveClass.description") {{ liveClass.description }}

  .course-content--container

    admin-tools(v-if="editingMode && editingMode !== 'transcript'" :liveclass="liveClass")

    #editingstate(v-if="editingMode === 'transcript'" @click="toggleEditingTranscript")
      | Finished Editing?
    
    #audio-snippets(v-if="liveClass.intros && (!editingMode || editingMode === 'intro')" :class="{ editing: editingMode }")
      audio-snippet(v-if="liveClass.intros" v-for="(intro, index) in liveClass.intros" :key="index" :intro="intro" :editing="editingMode")
      .clearfix

    action-panel(v-show="!editingMode" v-bind:content="liveClass" v-bind:current-class="currentClass")

    conversation-container(v-bind:content="liveClass" v-bind:collapsed="isCollapsed")

  #continue-listening(v-show="isCollapsed" name="continue-listening")
    .pure-button.pure-button-info.rounded-tall(@click="continueListening()") Continue Listening

  .course-content--footer(v-show="!isCollapsed")
    p {{ footerMessage }}
    .clearfix

</template>

<script>
import { mapGetters } from 'vuex'

import ActionPanel from '@/components/live/ActionPanel'
import AudioSnippet from '@/components/AudioSnippet'
import AdminTools from '@/components/AdminTools'
import ConversationContainer from '@/components/ConversationContainer'

import _find from 'lodash/find'

import emoji from 'node-emoji'

export default {
  name: 'live',
  components: {
    ActionPanel,
    AudioSnippet,
    AdminTools,
    ConversationContainer,
  },
  computed: {
    ...mapGetters(['currentClass', 'liveClass', 'isCollapsed', 'course', 'editingMode', 'isAdmin']),
    footerMessage () {
      return `Thanks for listening ${emoji.get('tada')}`
    }
  },
  methods: {
    continueListening() {
      this.$store.commit('EXPAND_CONVERSATION')
      setTimeout(() => {
        this.$store.commit('PLAY_MEDIA')
      }, 100)
    },
    toggleAdminTools() {
      this.$store.commit('EDITING_MODE', this.editingMode ? undefined : 'intro')
    },
    toggleEditingTranscript () {
      this.$store.commit('EDITING_MODE', 'other')
      this.$store.commit('EDITING_SEGMENT', undefined)
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'
@import '~stylus/layout/course-content'

.course-content
  background-color white !important
  margin-bottom 60px
  position relative

  .course-content--header.block

    svg
      color white

    #adminAction
      position absolute
      top 10px
      left 10px
      &:hover
        cursor pointer

    #engineType
      position absolute
      top 10px
      right 10px

    @media(max-width: 600px)
      radius(0)

  .course-content--footer
    p
      color $color-text-grey

  .course-content--container
    background-color white
    position relative

    #audio-snippets
      animate()
      background-color darken($color-info, 10%)
      min-height 60px
      padding 5px
      position relative
      &.editing
        background-color $color-tools

  .course-content--footer
    background-color white
    text-align center

  #editingstate
    radius-top(10px)
    background-color $color-success
    box-sizing border-box
    color white
    cursor pointer
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

  #continue-listening
    pinned()
    border-bottom-left-radius $corner-radius
    border-bottom-right-radius $corner-radius
    background-color white
    height 160px
    position relative
    text-align center
    @media(max-width: 600px)
      radius(0)
    .pure-button
      box-sizing()
      left 50%
      top calc(calc(160px - 52px) / 2)
      margin-left -100px
      position absolute
      width 200px
      &:hover
        cursor pointer
</style>
