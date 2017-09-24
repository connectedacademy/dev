<template lang="pug">

.course-content

  .course-content--header.block
    h1.content-title {{ content.title }}
    p.content-description(v-if="content.description") {{ content.description }}

  .course-content--container(v-bind:class="{ collapsed: collapsed }")

    action-panel(v-bind:content="content")

    conversation-container(v-bind:content="content")

    #continue-listening
      .pure-button.pure-button-primary(v-if="collapsed" @click="continueListening()") Continue Listening

</template>

<script>
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
    data() {
      return {
        collapsed: true,
      };
    },
    methods: {
      continueListening() {
        this.collapsed = false;
        const scrollPoint = find(this.$store.state.scrollPoints, {
          content_type: 'class'
        });
        this.$store.commit('setCurrentSection', scrollPoint);
        this.$store.commit('PLAY_VIDEO');
      }
    }
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
    overflow hidden
    position relative

    #continue-listening
      pinned()
      background-color white
      height 158px
      position absolute
      top auto
      text-align center
      .pure-button
        left 50%
        top calc(calc(158px - 40px) / 2)
        margin-left -100px
        position absolute
        width 200px
        &:hover
          cursor pointer

    &.collapsed
      max-height calc(calc(158px * 10) - 1px)
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
