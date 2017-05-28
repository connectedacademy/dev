<template lang="pug">

  .message-composer-wrapper(v-bind:class="{ static: section }")

    .message-composer(v-bind:class="{ isactive: visible, unactive: hidden }")

      .message-composer--body
        .textarea-wrapper(v-if="isRegistered" )
          textarea(name="name" rows="3" v-bind:placeholder="$t('composer.message_placeholder')" v-model="message.text" v-on:focus="composerFocus" v-on:blur="composerBlur")
        .login-warning(v-else @click="showAuth")
          h3 Please login to send messages
          .pure-button.pure-button-primary {{ $t('auth.login') }}

      .message-composer--footer(v-if="isRegistered")
        button.pure-button.pure-button-primary.pull-right(@click="sendMessage") {{ submitText }}
        p.info-label(v-if="!section") {{ $t('composer.duration', { currentTime: currentTime }) }}
        p.info-label(v-if="section") {{ `Current section - ${section}` }}
        .clearfix


</template>

<script>
import _ from 'lodash';
import * as types from '@/store/mutation-types';
import API from '@/api';
import {mapGetters} from 'vuex';

export default {
  name: 'message-composer',
  props: ['section'],
  data() {
    return {
      message: {
        text: '',
      },
      windowWidth: 0,
    };
  },
  methods: {
    showAuth() {
      this.$store.commit(types.SHOW_AUTH);
    },
    composerFocus() {
      this.$log.log('Composer gained focus');

      this.$log.log('Pausing video');
      this.$store.commit(types.PAUSE_VIDEO);

    },
    composerBlur() {
      this.$log.log('Composer lost focus');

      this.$log.log('Playing video');
      this.$store.commit(types.PLAY_VIDEO);

    },
    showComposer() {
      this.$store.commit(types.SHOW_COMPOSER);
    },
    dismissComposer() {
      this.$store.commit(types.DISMISS_COMPOSER);
    },
    sendMessage() {
      let postData = {};

      if (this.section) {
        const url = `https://testclass.connectedacademy.io/#/course/${this.$store.getters.currentClass.slug}/${this.section}`;

        postData = {
          text: `${this.message.text} ${this.$store.getters.course.hashtag} ${url}`,
          currentClass: this.$store.getters.currentClass.slug,
          currentSection: this.section,
        };
      } else {
        const url = this.url;

        postData = {
          text: `${this.message.text} ${this.$store.getters.course.hashtag} ${url}`,
          currentClass: this.$store.getters.currentClass.slug,
          currentSection: this.$store.getters.currentSection.slug,
          currentSegment: this.$store.getters.currentSegment,
        };
      }

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
    ...mapGetters(['isRegistered']),
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
    submitText() {
      return (this.$store.getters.activeSegmentVisible) ? 'Post Reply' : 'Send Message';
    }
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
      pinned()
      background-color white
      position absolute

      .login-warning
        pinned()
        background-color white
        z-index 2
        padding 0 20px
        position absolute
        text-align center
        h2
          nomargin()
          nopadding()
          line-height 45px !important

      .textarea-wrapper
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

  &.static

    .message-composer
      radius(4px)
      border $color-border 1px solid
      margin-bottom 20px
      overflow hidden
      position relative
      bottom auto
      top auto
      left auto
      right auto
      .message-composer--footer
        background-color #f9f9f9

</style>
