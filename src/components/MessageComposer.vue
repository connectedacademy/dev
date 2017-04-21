<template lang="pug">


  .message-composer-wrapper

    .message-composer(v-bind:class="{ isactive: visible, unactive: hidden }")

      .message-composer--header(v-on:click="showComposer")

        p.action-label {{ visible ? $t('composer.compose_message_active') : $t('composer.compose_message') }}

        p.position-label
          | {{ $t('composer.duration', { scrollPosition: scrollPosition }) }}

      .message-composer--body
        textarea(name="name" rows="3" v-bind:placeholder="$t('composer.message_placeholder')")


</template>

<script>
import * as types from '../store/mutation-types';

export default {
  name: 'message-composer',
  methods: {
    showComposer() {
      this.$store.commit(types.SHOW_COMPOSER);
    },
    dismissComposer() {
      this.$store.commit(types.DISMISS_COMPOSER);
    },
  },
  computed: {
    visible() {
      return this.$store.state.composer.visible;
    },
    hidden() {
      return !this.$store.getters.isRegistered ||
        this.$store.state.composer.hidden ||
        this.$store.state.auth.visible ||
        this.$store.state.navigation.leftDrawer.visible ||
        this.$store.state.navigation.rightDrawer.visible ||
        this.$store.state.route.name !== 'main';
    },
    scrollPosition() {
      return this.$store.getters.scrollPosition;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import "../assets/stylus/shared/*";

.message-composer-wrapper

  .message-composer
    background-color white
    border-radius 6px
    box-shadow 0px 0px 15px 0px alpha(black, 0.3)
    box-sizing border-box

    position fixed
    bottom -110px
    left 50%
    margin-left calc(-370px / 2)
    overflow hidden
    z-index 51

    height 160px
    width 370px
    max-width 100%

    transition bottom 0.6s, margin-left 0.6s, margin-bottom 0.6s, width 0.6s

    @media(max-width: 400px)
      margin-left calc(-50% + 15px)
      width calc(100% - 30px)

    &:hover
      cursor pointer
      bottom -105px

    .message-composer--header
      height 50px

      p
        margin 0
        padding 0 15px

        line-height 50px

        &.action-label
          float left

        &.position-label
          float right

    .message-composer--body
      background-color #f9f9f9
      height 120px

      textarea
        background-color #f9f9f9
        border none
        font-size 1em

        box-sizing border-box
        padding 15px
        height 110px
        width 100%
        outline 0

  .message-composer.isactive, .message-composer.isactive:hover
    bottom 50%
    margin-bottom calc(-160px / 2)
    margin-left calc(-370px / 2)
    z-index 51
    /*width 400px*/
    @media(max-width: 400px)
      radius(0px)
      bottom 0px
      top auto
      /*left auto*/
      margin-bottom 0
      margin-left calc(-100% / 2)
      width 100%

  .message-composer.unactive, .message-composer.unactive:hover
    bottom -160px
    box-shadow none

</style>
