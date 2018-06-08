<template lang="pug">

.course-content#liveclass(name="section-liveclass" v-if="liveClass")
  
  .course-content--header.block
    i.fab.fa-twitter.fa-lg(v-if="course.engine === 'twitter'" title="Messages are published on Twitter")
    i.fas.fa-comment.fa-lg(v-if="course.engine === 'local'" title="Messages are stored on Connected Academy")
    h1.content-title
      | {{ liveClass.title }}
    p.content-description(v-if="liveClass.description") {{ liveClass.description }}

  .course-content--container(v-bind:class="{ collapsed: isCollapsed }")

    //- audio-snippet(:title="liveClass.intro.title" :url="liveClass.intro.audio")

    action-panel(v-bind:content="liveClass" v-bind:current-class="currentClass")

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
import ConversationContainer from '@/components/ConversationContainer'

import _find from 'lodash/find'

import emoji from 'node-emoji'

export default {
  name: 'live',
  components: {
    ActionPanel,
    AudioSnippet,
    ConversationContainer,
  },
  computed: {
    ...mapGetters(['currentClass', 'liveClass', 'isCollapsed', 'course']),
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
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/buttons'
@import '~stylus/layout/course-content'

.course-content
  background-color white !important
  margin-bottom 240px
  position relative

  .course-content--header.block

    svg
      color white
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

    &.collapsed
      height 927px
      max-height 927px
      overflow hidden
    
    .liveclass-introduction
      background-color $color-lightest-grey
      padding 20px
      text-align center

  .course-content--footer
    background-color white
    text-align center

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
      top calc(calc(160px - 40px) / 2)
      margin-left -100px
      position absolute
      width 200px
      &:hover
        cursor pointer
</style>
