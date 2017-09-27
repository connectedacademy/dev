<template lang="pug">

  .message-composer-wrapper(v-bind:class="{ static: section }")

    .message-composer(v-bind:class="{ unactive: hidden }")

      .message-composer--body
        .textarea-wrapper(v-if="isRegistered" )
          textarea(name="name" rows="3" @keydown.enter.prevent.stop="sendMessage" v-bind:placeholder="$t('composer.message_placeholder')" v-model="message.text")
        .login-warning(v-else @click="showAuth()")
          | Please login to send messages

      .message-composer--footer(v-if="isRegistered")
        button.pure-button.pure-button-primary.pull-right(@click="sendMessage")
          span(v-if="infoLabel") {{ infoLabel }}
          span(v-else) {{ submitText }}
        .clearfix


</template>

<script>
import API from '@/api';
import {mapGetters} from 'vuex';

import Auth from '@/mixins/Auth';

import round from 'lodash/round';

export default {
  name: 'message-composer',
  props: ['section'],
  mixins: [
    Auth,
  ],
  data() {
    return {
      infoLabel: '',
      message: {
        text: '',
      },
      windowWidth: 0,
      sending: false,
    };
  },
  methods: {
    sendMessage() {
      const url = (this.section) ? `https://${this.course.slug}.connectedacademy.io/#/course/${this.currentClass.slug}/${this.section}` : this.url;

      let postData = {
        text: `${this.message.text} ${this.course.hashtag} ${url}`,
        currentClass: this.currentClass.slug,
        currentSection: (this.section) ? this.section : this.currentSection.slug,
        currentSegment: (this.section) ? this.messageSegment : undefined,
      };

      this.sending = true;

      API.message.sendMessage(
        postData,
        (response, postData) => {
          // this.$store.dispatch('pushMessage', { response, postData });
          this.$store.commit('SEND_MESSAGE_SUCCESS', { response, postData })
          this.message.text = '';
          this.infoLabel = 'Posted note';
          setTimeout(() => { this.infoLabel = ""}, 2000);
          this.sending = false;
        },
        (response, postData) => {
          this.$store.commit('SEND_MESSAGE_FAILURE', { response })
          alert('Failed to send message');
          this.infoLabel = 'Failed to post note';
          setTimeout(() => { this.infoLabel = ""}, 2000);
          this.sending = false;
        },
      );
    },
  },
  computed: {
    ...mapGetters(['isRegistered', 'peekSegment', 'currentSegment', 'isRegistered', 'course', 'currentClass', 'currentSection']),
    messageSegment() {
      return this.peekSegment ? (this.peekSegment / 0.2) : this.currentSegment;
    },
    url() {
      if (this.currentSection === undefined) { return ''; }
      return `https://${this.course.slug}.connectedacademy.io/#/course/${this.currentClass.slug}/${this.currentSection.slug}/${this.messageSegment}`;
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
    submitText() {
      return (this.sending) ? 'Sending..' : 'Post';
    }
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

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
    box-sizing()

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
        font-weight bold
        color $color-text-dark-grey
        line-height 50px !important
        &:hover
          cursor pointer
          color darken($color-text-dark-grey, 10%)

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

          box-sizing()
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
      height 40px
      padding 5px
      position absolute
      bottom 0
      right 0
      left auto
      animate()
      button.pure-button.pure-button-primary
        line-height 38px
        padding 0 25px
      .info-label
        reset()
        radius(5px)
        display inline-block
        background-color $color-border
        color $color-text-dark-grey
        font-size 1em
        line-height 30px
        margin 0px 15px
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

</style>
