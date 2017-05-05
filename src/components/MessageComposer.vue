<template lang="pug">

  .message-composer-wrapper

    .message-composer(v-bind:class="{ isactive: visible, unactive: hidden }")

      .message-composer--header(v-on:click="showComposer")

        p.action-label {{ visible ? $t('composer.compose_message_active') : $t('composer.compose_message') }}

        p.position-label
          | {{ $t('composer.duration', { currentTime: currentTime }) }}

      .message-composer--body
        textarea(name="name" rows="3" v-bind:placeholder="$t('composer.message_placeholder')" v-model="message.text")

      .message-composer--footer
        button.pure-button.pure-button-primary.pull-right(@click="sendMessage") Send
        .clearfix


</template>

<script>
import _ from 'lodash';
import * as types from '../store/mutation-types';
import API from '../api';

export default {
  name: 'message-composer',
  methods: {
    showComposer() {
      this.$store.commit(types.SHOW_COMPOSER);
    },
    dismissComposer() {
      this.$store.commit(types.DISMISS_COMPOSER);
    },
    sendMessage() {
      const postData = {
        text: this.message.text,
      };

      API.message.sendMessage(
        postData,
        (response) => {
          this.$store.commit(types.SEND_MESSAGE_SUCCESS, { response })
        },
        (response) => {
          this.$store.commit(types.SEND_MESSAGE_FAILURE, { response })
        },
      );
    },
  },
  computed: {
    url() {
      if (this.$store.getters.currentSection === undefined) { return ''; }
      return `http://localhost:8080/#/course/${this.$store.getters.currentClass.slug}/${this.$store.getters.currentSection.slug}/${this.$store.getters.currentSegment}`;
    },
    message() {
      if (this.$store.getters.currentSection === undefined) { return ''; }
      return {
        text: `Test message ${this.$store.getters.course.hashtag} - ${this.url}`,
      };
    },
    visible() {
      return this.$store.state.composer.visible;
    },
    hidden() {
      return (this.$store.getters.currentSection === undefined) ||
        !this.$store.getters.isRegistered ||
        this.$store.state.composer.hidden ||
        this.$store.state.auth.visible ||
        this.$store.state.navigation.leftDrawer.visible ||
        this.$store.state.navigation.rightDrawer.visible ||
        this.$store.state.route.name !== 'main';
    },
    currentTime() {
      return this.$store.getters.currentTime;
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
    bottom -128px
    left 50%
    margin-left calc(-370px / 2)
    overflow hidden
    z-index 51

    height 178px
    width 370px
    max-width 100%

    transition bottom 0.6s, margin-left 0.6s, margin-bottom 0.6s, width 0.6s

    @media(max-width: 400px)
      margin-left calc(-50% + 15px)
      width calc(100% - 30px)

    &:hover
      cursor pointer
      bottom -115px

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
      height 80px

      textarea
        background-color #f9f9f9
        border none
        font-size 1em

        box-sizing border-box
        padding 15px
        height 70px
        resize none
        width 100%
        outline 0

    .message-composer--footer
      background-color #f9f9f9
      height 38px
      padding 5px

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
