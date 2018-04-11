<template lang="pug">

.course-content#liveclass(name="section-liveclass")
  
  .course-content--header.block
    i.fab.fa-twitter.fa-lg
    h1.content-title
      | {{ content.title }}
    p.content-description(v-if="content.description") {{ content.description }}

  .course-content--container(v-bind:class="{ collapsed: isCollapsed }")

    action-panel(v-bind:content="content" v-bind:current-class="currentClass")

    conversation-container(v-bind:content="content" v-bind:collapsed="isCollapsed")

  #continue-listening(v-show="isCollapsed" name="continue-listening")
    .pure-button.pure-button-info.rounded-tall(@click="continueListening()") Continue Listening

  .course-content--footer(v-show="!isCollapsed")
    p {{ footerMessage }}
    .clearfix

</template>

<script>
import { mapGetters } from 'vuex'

import ActionPanel from '@/components/live/ActionPanel'
import ConversationContainer from '@/components/ConversationContainer'

import _find from 'lodash/find'

import emoji from 'node-emoji'

export default {
  name: 'live',
  components: {
    ActionPanel,
    ConversationContainer,
  },
  computed: {
    ...mapGetters(['currentClass', 'isCollapsed']),
    footerMessage () {
      return `Thanks for listening ${emoji.get('tada')}`
    },
    content () {
      if (!this.currentClass) return {}
      return _find(this.currentClass.content, { content_type: 'class' })
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
  position relative

  .course-content--header.block

    svg
      color white
      position absolute
      top 10px
      right 10px

    .pure-button
      background-color transparent
      border white 1px solid
      color white
      margin 10px auto 5px auto
      &:hover
        background-color white
        color $color-warning

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
