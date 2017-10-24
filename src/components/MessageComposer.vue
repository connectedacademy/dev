<template lang="pug">

  .message-composer-wrapper(v-bind:class="{ static: static }")

    .message-composer(v-bind:class="{ unactive: hidden }")

      .message-composer--body
      
        .replying-to-banner(v-if="replyingTo")
          p {{ $t('composer.replying_to', { name: replyingTo.author.name }) }}
          .dismiss-replying-to.animated.fadeInRight(@click="cancelReply")
            icon(name="times")

        .message-composer--footer(v-if="isRegistered")
          .textarea-wrapper
            .textarea-inner-wrapper(v-bind:class="{ focussed: (composerFocussed || showAction) }")
              textarea-autosize(name="composer-textarea" ref="textarea" rows="1" v-on:input="inputChanged" @focus.native="composerFocussed = true" @keydown.native.enter.prevent.stop="sendMessage" @blur.native="composerFocussed = false" v-bind:placeholder="replyingTo ? $t('composer.reply_placeholder') : $t('composer.message_placeholder')" v-model="message.text" v-bind:min-height="10" v-bind:max-height="200")
              .appended-contents(v-if="showAction") {{ hashtags }} {{ shortenedUrl }}

          .composer-actions(v-if="showAction" ref="composeractions")
            #character-count.pull-left(v-bind:class="{ warn: (messageLength > (maxCharacterCount - 20)), danger: (messageLength > maxCharacterCount) }") {{ maxCharacterCount - messageLength }}
            button#send-button.pure-button.pure-button-info.pull-right(@click="sendMessage" v-bind:class="{ disabled: (messageLength > maxCharacterCount) }")
              span(v-if="infoLabel") {{ infoLabel }}
              span(v-else) {{ submitText }}
            .clearfix

        .login-warning(v-else @click="showAuth()") {{ $t('composer.login_required') }}

</template>

<script>
import Vue from 'vue';
import API from '@/api';
import { mapGetters } from 'vuex';
import { EventBus } from '@/event-bus.js';
import VueTextareaAutosize from 'vue-textarea-autosize'

import Auth from '@/mixins/Auth';

import info from 'vue-awesome/icons/info';
import times from 'vue-awesome/icons/times';

Vue.use(VueTextareaAutosize)

export default {
  name: 'message-composer',
  props: ['static', 'classSlug', 'contentSlug', 'currentSegment'],
  mixins: [
    Auth,
  ],
  mounted() {
    if (!this.static) {
      // Auto focus textarea
      this.$refs.textarea.$el.focus();
    }
  },
  data() {
    return {
      composerFocussed: false,
      minCharacterCount: 5,
      maxCharacterCount: 140,
      infoLabel: '',
      message: {
        text: '',
      },
      windowWidth: 0,
      sending: false,
    };
  },
  watch: {
    composerFocussed() {
      this.calculateHeight();
    },
    'message': {
      handler: function(nV, oV) {
        this.$nextTick(() => {
          this.calculateHeight();
        });
      },
      deep: true,
    },
  },
  methods: {
    inputChanged() {
      this.calculateHeight();
    },
    calculateHeight() {
      const textareaPadding = 20;
      const appendedHeight = (this.showAction) ? 30 : 0;
      const footerHeight = (this.$refs.composeractions) ? this.$refs.composeractions.clientHeight : 0;
      const notAuthed = this.isRegistered ? 0 : 50;
      this.$emit('update:quickNoteHeight', (this.$refs.textarea.$el.clientHeight + textareaPadding + footerHeight + appendedHeight + notAuthed));
    },
    cancelReply() {
      this.$store.commit('SET_REPLYING_TO', undefined);
    },
    sendMessage() {
      let postData = {
        text: `${this.message.text} ${this.hashtags} ${this.url}`,
        currentClass: this.classSlug,
        currentSection: this.contentSlug,
        currentSegment: (this.currentSegment / 0.2),
      };

      // If this is a reply then append message id
      if (this.replyingTo) { postData.replyto = this.replyingTo.message_id; }

      this.sending = true;

      API.message.sendMessage(
        postData,
        (response, postData) => {
          this.$store.commit('SEND_MESSAGE_SUCCESS', { response, postData })
          this.message.text = '';
          this.infoLabel = (this.replyingTo) ? 'Replied to note' : 'Posted note';
          setTimeout(() => { this.infoLabel = ""}, 2000);
          this.sending = false;
          this.$store.commit('SET_REPLYING_TO', undefined);
          EventBus.$emit('messagePosted', response);
        },
        (response, postData) => {
          this.$store.commit('SEND_MESSAGE_FAILURE', { response })
          alert('Failed to send message');
          this.infoLabel = (this.replyingTo) ? 'Failed to reply' : 'Failed to post';
          setTimeout(() => { this.infoLabel = ""}, 2000);
          this.sending = false;
          this.$store.commit('SET_REPLYING_TO', undefined);
        },
      );
    },
  },
  computed: {
    ...mapGetters([
      'isRegistered',
      'peekSegment',
      'isRegistered',
      'course',
      'currentClass',
      'currentSection',
      'replyingTo'
    ]),
    hashtags() {
      return this.course.hashtag;
    },
    url() {
      let url = `https://${this.course.slug}.connectedacademy.io/#/course/${this.classSlug}/${this.contentSlug}`;
      if (!this.static){
        return `${url}/${(this.currentSegment / 0.2)}`;
      }
      return url;
    },
    shortenedUrl() {
      return `${this.url.substring(0, 20)}...${this.url.substring(this.url.length - 20, this.url.length)}`;
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
      if (this.sending) return 'Sending..';
      return (this.replyingTo) ? 'Reply' : 'Post';
    },
    showAction() {
      // return true; // TODO // Remove this line
      return (this.messageLength > this.minCharacterCount);
    },
    messageLength() {
      return this.message.text.length;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

.message-composer-wrapper

  .message-composer
    animate()
    box-sizing()

    .message-composer--body

      .replying-to-banner
        background-color $color-info
        color white
        position absolute
        top -40px
        line-height 40px
        height 40px
        overflow hidden
        width 100%
        p
          reset()
          padding 0 15px
        .fa-icon
          height 40px
          margin 0 15px
          width 6px
        .dismiss-replying-to
          pinned()
          animate()
          background-color darken($color-info, 10%)
          position absolute
          left auto
          min-width 40px
          .fa-icon
            margin 0 20px
            width 14px
          &:hover
            cursor pointer
            background-color darken($color-info, 20%)
      .login-warning
        background-color white
        z-index 2
        padding 0 20px
        text-align center
        font-weight bold
        color $color-text-dark-grey
        line-height 50px !important
        &:hover
          cursor pointer
          color darken($color-text-dark-grey, 10%)

      .message-composer--footer
        background-color white
        .textarea-wrapper
          .textarea-inner-wrapper
            animate()
            radius(10px)
            margin 10px
            overflow hidden
            textarea
              animate()
              box-sizing()
              radius(10px)
              background-color transparent
              border none
              display block
              font-size 0.9em
              outline 0
              padding 10px
              width 100%
            .appended-contents
              color alpha(black, 0.5)
              display none
              line-height 20px
              padding 0 10px 10px 10px
              white-space nowrap
            &.focussed
              background-color $color-lighter-grey
              .appended-contents
                display block
        
        .composer-actions
          padding 0 10px 10px 10px
          #character-count
            color $color-text-grey
            font-size 0.9em
            line-height 26px
            padding 0 6px
            &.warn
              color $color-warning
            &.danger
              color $color-danger

          button#send-button
            radius(13px)
            line-height 26px
            margin 0
            padding 0 15px
            &.disabled
              background-color white
              border-color white
              color $color-text-grey
              text-decoration line-through
              pointer-events none
              
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
