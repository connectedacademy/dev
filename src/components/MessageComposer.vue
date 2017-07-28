<template lang="pug">

  .message-composer-wrapper(v-bind:class="{ static: section, 'segment-view': activeSegment }")

    .message-composer(v-bind:class="{ unactive: hidden }")

      .message-composer--body
        .textarea-wrapper(v-if="isRegistered" )
          textarea(name="name" autofocus rows="3" v-on:keyup.prevent.enter="sendMessage" v-bind:placeholder="$t('composer.message_placeholder')" v-model="message.text" v-on:focus="composerFocus" v-on:blur="composerBlur")
        .login-warning(v-else)
          h4 Please login to send messages

      .message-composer--footer(v-if="isRegistered")
        button.pure-button.pure-button-primary.pull-right(@click="sendMessage") {{ submitText }}
        p.info-label.animated.fadeInUp(v-if="infoLabel") {{ infoLabel }}
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
      focussed: false,
      infoLabel: '',
      message: {
        text: '',
      },
      windowWidth: 0,
      sending: false,
    };
  },
  methods: {
    showAuth() {
      this.$store.commit(types.SHOW_AUTH);
    },
    // snapScroll() {
    //   return;
    //
    //   let oldPos = this.currentSection.top + (_.ceil(_.divide(this.currentSectionScrollPosition, 158)) * 158);
    //   oldPos = oldPos - (window.innerHeight - 410);
    //
    //   if (oldPos !== this.scrollPosition) {
    //
    //     this.$store.commit('setPendingScrollPosition', oldPos);
    //   }
    // },
    composerFocus() {
      this.$log.log('Composer gained focus');
      this.focussed = true;
      // this.$store.commit(types.PAUSE_VIDEO);

      // if (!this.activeSegment) {
      //   this.$store.commit(types.SET_ACTIVE_SEGMENT, this.$store.getters.currentSegmentGroup);
      // }
    },
    composerBlur() {
      this.$log.log('Composer lost focus');
      this.focussed = false;
      // var self = this;
      // setTimeout(function() {
      //   self.$store.commit(types.PLAY_VIDEO);
      // }, 300);
    },
    showComposer() {
      this.$store.commit(types.PEEK_COMPOSER);
    },
    dismissComposer() {
      this.$store.commit(types.DISMISS_COMPOSER);
    },
    sendMessage() {

      this.sending = true;

      let postData = {};

      if (this.section) {
        const url = `https://testclass.connectedacademy.io/#/course/${this.currentClass.slug}/${this.section}`;

        postData = {
          text: `${this.message.text} ${this.course.hashtag} ${url}`,
          currentClass: this.currentClass.slug,
          currentSection: this.section,
        };
      } else {
        const url = this.url;

        postData = {
          text: `${this.message.text} ${this.course.hashtag} ${url}`,
          currentClass: this.currentClass.slug,
          currentSection: this.currentSection.slug,
          currentSegment: this.messageSegment,
        };
      }

      API.message.sendMessage(
        postData,
        (response, postData) => {
          this.$store.dispatch('pushMessage', { response, postData });
          this.$store.commit(types.SEND_MESSAGE_SUCCESS, { response, postData })
          // this.$store.commit(types.PLAY_VIDEO);
          this.message.text = '';
          this.sending = false;
          this.infoLabel = 'Message sent successfully';
          var self = this; setTimeout(function() {self.infoLabel = ""}, 2000);
        },
        (response, postData) => {
          this.$store.commit(types.SEND_MESSAGE_FAILURE, { response })
          alert('Failed to send message');
          this.sending = false;
          this.infoLabel = 'Failed to send message!';
          var self = this; setTimeout(function() {self.infoLabel = ""}, 2000);
        },
      );
    },
  },
  computed: {
    ...mapGetters(['isRegistered', 'activeSegment', 'currentSegment', 'isRegistered', 'course', 'currentClass', 'currentSection', 'currentActiveSection', 'currentSectionScrollPosition', 'scrollPosition']),
    messageSegment() {
      return this.activeSegment ? (this.activeSegment / 0.2) : this.currentSegment;
    },
    url() {
      if (this.currentSection === undefined) { return ''; }
      return `https://testclass.connectedacademy.io/#/course/${this.currentClass.slug}/${this.currentSection.slug}/${this.messageSegment}`;
    },
    hidden() {
      return (this.currentSection === undefined) ||
        !this.isRegistered ||
        this.$store.state.composer.hidden ||
        this.$store.state.auth.visible ||
        this.$store.state.navigation.leftDrawer.visible ||
        this.$store.state.navigation.rightDrawer.visible ||
        this.$store.state.route.name !== 'main';
    },
    currentTime() {
      return `Tweeting at - ${_.round(this.currentTime)}`;
    },
    submitText() {
      if (this.sending) {
        return 'Sending';
      } else {
        return (this.activeSegment) ? 'Post' : 'Post';
      }
    }
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.message-composer-wrapper
  pinned()
  position absolute
  left 50%
  position relative
  top auto
  bottom auto
  left auto
  right auto
  height 50px
  // border-top $color-border 1px solid

  @media(max-width: 800px)
    width 100%
    left 0
    right 0
    margin 0

  .message-composer
    animate()
    pinned()
    top 0
    box-sizing border-box

    position absolute
    z-index 2

    .message-composer--body
      pinned()
      position absolute

      .login-warning
        pinned()
        background-color white
        z-index 2
        padding 0 20px
        position absolute
        text-align center
        h4
          reset()
          color $color-text-dark-grey
          line-height 50px !important

      .textarea-wrapper
        overflow hidden
        position absolute
        top 0
        bottom 0
        right 0
        left 0
        textarea
          border none
          font-size 1em

          box-sizing border-box
          padding 15px
          resize none
          outline 0

          position absolute
          top 0
          bottom 0
          right 100px
          left 0

          width 100%
          animate()
          @media(max-width: 800px)
            right 10px
            width calc(100% - 20px)

    .message-composer--footer
      height 30px
      padding 10px
      position absolute
      bottom 0
      right 0
      left auto
      animate()
      button.pure-button.pure-button-primary
        padding 3px 20px
      @media(max-width: 800px)
        padding 10px
      p.info-label
        reset()
        radius(5px)
        display inline-block
        background-color $color-success
        color white
        font-size 0.9em
        line-height 28px
        margin 0px
        padding 0 15px

  &.static

    radius(4px)
    border $color-border 1px solid
    margin-bottom 20px
    overflow hidden
    position relative !important
    bottom auto
    top auto
    left auto
    right auto
    .message-composer
      border-top none
      top 0
    .message-composer--footer
      border-top $color-border 1px solid

  &.segment-view
    .message-composer--footer
      left 0
</style>
