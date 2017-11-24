<template lang="pug">

.course-content(name="section-liveclass")

  .course-content--header.block
    icon(name="twitter")
    h1.content-title {{ content.title }}
    p.content-description(v-if="content.description") {{ content.description }}

  .course-content--container(v-bind:class="{ collapsed: isCollapsed }")

    action-panel(v-bind:content="content" v-bind:current-class="currentClass")

    conversation-container(v-bind:content="content" v-bind:collapsed="isCollapsed")

  #continue-listening(v-if="isCollapsed" name="continue-listening")
    .pure-button.pure-button-info.rounded-tall(@click="continueListening()") Continue Listening

</template>

<script>
import { mapGetters } from 'vuex';

import ActionPanel from '@/components/conversation/ActionPanel';
import ConversationContainer from '@/components/ConversationContainer';

import _find from 'lodash/find';
import twitter from 'vue-awesome/icons/twitter';

export default {
  name: 'live-class',
  props: ['content', 'currentClass'],
  components: {
    ActionPanel,
    ConversationContainer,
  },
  computed: {
    ...mapGetters(['isCollapsed', 'scrollPoints'])
  },
  methods: {
    continueListening() {
      this.$store.commit('EXPAND_CONVERSATION');

      const scrollPoint = _find(this.scrollPoints, { content_type: 'class' });
      this.$store.commit('SET_CURRENT_SECTION', scrollPoint);
      setTimeout(() => {
        this.$store.commit('PLAY_MEDIA');
      }, 100);
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

    .fa-icon
      color white
      height 20px
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
    background-color white
    height 160px
    position relative
    // top auto
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
