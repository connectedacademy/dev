<template lang="pug">

.course-content

  .course-content--header.block
    h1.content-title {{ content.title }}
    p.content-description(v-if="content.description") {{ content.description }}

  .course-content--container(v-bind:class="{ collapsed: collapsed }")
    #fade-out(v-if="collapsed")

    action-panel(v-bind:content="content" v-bind:video-is-active="videoIsActive" v-bind:active-segment="activeSegment")

    conversation-container(v-if="content.content_type === 'class'" v-bind:content="content")

  .course-content--footer
    .pure-button.pure-button-primary(v-if="collapsed" @click="collapsed = false") Continue Listening
    .pure-button.pure-button-primary(v-if="!collapsed" @click="collapsed = true") Finished Listening

</template>

<script>
import _ from 'lodash/core';
import * as config from '@/api/config';
import {mapGetters} from 'vuex';

import ActionPanel from '@/components/conversation/ActionPanel';
import ConversationContainer from '@/components/ConversationContainer';

export default {
  name: 'live-class',
  props: ['content'],
  components: {
    ActionPanel,
    ConversationContainer,
  },
  data() {
    return {
      collapsed: true,
    };
  },
  computed: {
    ...mapGetters(['activeSegment', 'videoIsActive']),
  },
};
</script>

<style lang="stylus" scoped>
@import '~stylus/shared'
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

    &.collapsed
      max-height 1000px
      overflow hidden

  .course-content--footer
    background-color white
    text-align center

#fade-out
  pinned()
  background transparent
  background -webkit-linear-gradient(bottom, alpha(white, 1.0), alpha(white, 0.0))
  background -o-linear-gradient(bottom, alpha(white, 1.0), alpha(white, 0.0))
  background -moz-linear-gradient(bottom, alpha(white, 1.0), alpha(white, 0.0))
  background linear-gradient(bottom, alpha(white, 1.0), alpha(white, 0.0))
  position absolute
  z-index 1
  height 300px
  top auto
  pointer-events none
</style>
