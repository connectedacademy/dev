<template lang="pug">

  .message-composer-wrapper

    .message-composer(v-bind:class="{ isactive: visible, unactive: hidden }")

      .message-composer--body
        .textarea-wrapper
          textarea(name="name" rows="3" v-bind:placeholder="$t('composer.message_placeholder')" v-model="message.text")

      .message-composer--footer
        button.pure-button.pure-button-primary.pull-right(@click="sendMessage")
          | Send Tweet
        p.info-label
          span#time {{ $t('composer.duration', { currentTime: currentTime }) }}
          span#url {{ url }}
        .clearfix


</template>

<script>
import _ from 'lodash';
import * as types from '@/store/mutation-types';
import API from '@/api';

export default {
  name: 'message-composer',
  data() {
    return {
      message: {
        text: '',
      },
      windowWidth: 0,
    };
  },
  methods: {
    showComposer() {
      this.$store.commit(types.SHOW_COMPOSER);
    },
    dismissComposer() {
      this.$store.commit(types.DISMISS_COMPOSER);
    },
    sendMessage() {
      const postData = {
        text: `${this.message.text} ${this.$store.getters.course.hashtag} ${this.url}`,
        currentClass: this.$store.getters.currentClass.slug,
        currentSection: this.$store.getters.currentSection.slug,
        currentSegment: this.$store.getters.currentSegment,
      };

      API.message.sendMessage(
        postData,
        (response, postData) => {
          this.$store.dispatch('pushMessage', { response, postData });
          this.$store.commit(types.SEND_MESSAGE_SUCCESS, { response, postData })
        },
        (response, postData) => {
          this.$store.commit(types.SEND_MESSAGE_FAILURE, { response })
        },
      );
    },
  },
  computed: {
    url() {
      if (this.$store.getters.currentSection === undefined) { return ''; }
      return `https://testclass.connectedacademy.io/#/course/${this.$store.getters.currentClass.slug}/${this.$store.getters.currentSection.slug}/${this.$store.getters.currentSegment}`;
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
      return `Tweeting at - ${_.round(this.$store.getters.currentTime)}`;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import "../assets/stylus/shared/*";

.message-composer-wrapper

  .message-composer
    background-color white
    border-top $color-light-grey 1px solid
    box-sizing border-box

    position absolute
    bottom 0
    right 0

    height 140px
    left calc(140px / 0.5625)
    animate()

    @media(max-width: 800px)
      width 100%
      left 0
      right 0
      margin 0

    .message-composer--body
      background-color darken($color-purple, 20%) //#f9f9f9
      pinned()
      position absolute

      .textarea-wrapper
        /*radius(4px)*/
        background-color white
        overflow hidden
        position absolute
        top 0
        bottom 0
        right 0
        left 0
        textarea
          background-color transparent
          color black
          border none
          font-size 1em

          box-sizing border-box
          padding 15px
          resize none
          outline 0

          position absolute
          top 0
          bottom 48px
          right 0
          left 0

          width 100%
          animate()
          @media(max-width: 800px)
            right 10px
            width calc(100% - 20px)

    .message-composer--footer
      border-top $color-light-grey 1px solid
      height 38px
      padding 5px
      position absolute
      bottom 0
      right 0
      left 0
      animate()
      @media(max-width: 800px)
        padding 10px
      p.info-label
        nopadding()
        color $color-text-dark-grey
        font-size 0.9em
        line-height 38px
        margin 0 5px
        #url
          display none
        #time
          display block
        &:hover
          #url
            display block
          #time
            display none
</style>
