<template lang="pug">

.course-content

  .course-content--header.block
    h1.content-title {{ content.title }}
    p.content-description(v-if="content.description") {{ content.description }}
    .pure-button.pure-button-primary(@click="collapsed = !collapsed") Join Live Class

  .course-content--container(v-bind:class="{ collapsed: collapsed }")
    #fade-out(v-if="collapsed")
    conversation-container(v-if="content.content_type === 'class'" v-bind:content="content")

  .course-content--footer
    .pure-button.pure-button-primary(@click="collapsed = !collapsed") Continue Listening

</template>

<script>
import _ from 'lodash';
import * as config from '@/api/config';
import {mapGetters} from 'vuex';

import ConversationContainer from '@/components/ConversationContainer';

export default {
  name: 'live-class',
  props: ['content'],
  components: {
    ConversationContainer,
  },
  data() {
    return {
      collapsed: true,
    };
  },
};
</script>

<style lang="stylus" scoped>
@import '~stylus/shared'
@import '~stylus/layout/course-content'

.course-content#course-content-liveclass
  background-color $color-darkest-grey !important
  overflow hidden
  position relative

  .course-content--header.block
    background-color $color-darkest-grey

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
    padding-top 20px
    position relative

    &.collapsed
      max-height 1000px
      overflow hidden

  .course-content--footer
    background-color white
    text-align center

#fade-out
  pinned()
  position absolute
  background-color red
  background linear-gradient(bottom, alpha(white, 1.0), alpha(white, 0.0))
  z-index 1
  height 300px
  top auto
  /*left 50%*/
  /*bottom 219px*/
  /*margin-left calc(-780px / 2)*/
  /*width 780px*/
</style>
