<template lang="pug">

.course-content(name="section-liveclass")

  .course-content--header.block
    h1.content-title {{ content.title }}
    p.content-description(v-if="content.description") {{ content.description }}

  .course-content--container(v-bind:class="{ collapsed: isCollapsed }")

    action-panel(v-bind:content="content")

    conversation-container(v-bind:content="content" v-bind:collapsed="isCollapsed")

    #continue-listening(v-if="isCollapsed" name="continue-listening")
      .pure-button.pure-button-continue(@click="continueListening()") Continue Listening

</template>

<script>
import { mapGetters } from 'vuex';

import ActionPanel from '@/components/conversation/ActionPanel';
import ConversationContainer from '@/components/ConversationContainer';

import find from 'lodash/find';

export default {
  name: 'live-class',
  props: ['content'],
  components: {
    ActionPanel,
    ConversationContainer,
  },
  computed: {
    ...mapGetters(['isCollapsed'])
  },
  methods: {
    continueListening() {
      this.$store.commit('EXPAND_CONVERSATION');
      const scrollPoint = find(this.$store.state.scrollPoints, {
        content_type: 'class'
      });
      this.$store.commit('setCurrentSection', scrollPoint);
    }
  }
};
</script>

<style lang="stylus" scoped>

@import '~stylus/buttons'
@import '~stylus/layout/course-content'

.course-content#course-content-liveclass
  background-color $color-darkest-grey !important
  position relative

  .course-content--header.block
    background-color $color-darkest-grey
    border-top-left-radius 6px
    border-top-right-radius 6px

    .pure-button
      background-color transparent
      border white 1px solid
      color white
      margin 10px auto 5px auto
      &:hover
        background-color white
        color $color-warning

  .course-content--container
    background-color white
    position relative

    #continue-listening
      pinned()
      background-color white
      height 160px
      position absolute
      top auto
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

    &.collapsed
      max-height 950px
      overflow hidden

  .course-content--footer
    background-color white
    text-align center
</style>
