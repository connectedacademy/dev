<template lang="pug">

  .message-composer-wrapper

    .message-composer

      .message-composer--body
      
        .replying-to-banner(v-if="replyingTo")
          p {{ $t('composer.replying_to', { name: replyingTo._user.profile.name }) }}
          .dismiss-replying-to.animated.fadeInRight(@click="cancelReply")
            icon(icon="times")

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
import Vue from 'vue'
import API from '@/api'
import { mapGetters } from 'vuex'
import { Events } from '@/events.js'
import VueTextareaAutosize from 'vue-textarea-autosize'

import Auth from '@/mixins/Auth'

Vue.use(VueTextareaAutosize)

export default {
  name: 'message-composer',
  props: ['classSlug', 'contentSlug', 'currentSegmentGroup'],
  mixins: [
    Auth,
  ],
  mounted() {
    // Auto focus textarea
    if (this.$refs.textarea) this.$refs.textarea.$el.focus()
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
    }
  },
  watch: {
    composerFocussed() {
      this.calculateHeight()
    },
    'message': {
      handler: function(nV, oV) {
        this.$nextTick(() => {
          this.calculateHeight()
        })
      },
      deep: true,
    },
  },
  methods: {
    inputChanged() {
      this.calculateHeight()
    },
    calculateHeight() {
      const textareaPadding = 20
      const appendedHeight = (this.showAction) ? 30 : 0
      const footerHeight = (this.$refs.composeractions) ? this.$refs.composeractions.clientHeight : 0
      const notAuthed = this.isRegistered ? 0 : 50
      const textareaHeight = (this.$refs.textarea) ? this.$refs.textarea.$el.clientHeight : 0
      this.$emit('update:quickNoteHeight', (textareaHeight + textareaPadding + footerHeight + appendedHeight + notAuthed))
    },
    cancelReply() {
      this.$store.commit('SET_REPLYING_TO', undefined)
    },
    sendMessage() {
      let composedMessage = `${this.message.text} ${this.hashtags} ${this.url}`
      let postData = {
        text: composedMessage,
        currentClass: this.classSlug,
        currentSection: 'liveclass',
        currentSegmentGroup: this.currentSegmentGroup,
      }
      // If this is a reply then append message id
      if (this.replyingTo) { postData.replyTo = this.replyingTo._id }

      this.sending = true

      API.message.sendMessage(
        postData,
        (response, postData) => {
          this.message.text = ''
          this.infoLabel = (this.replyingTo) ? 'Replied to note' : 'Posted note'
          setTimeout(() => { this.infoLabel = ""}, 2000)
          this.sending = false
          this.$store.commit('SET_REPLYING_TO', undefined)
        },
        (response, postData) => {
          alert('Failed to send message')
          this.infoLabel = (this.replyingTo) ? 'Failed to reply' : 'Failed to post'
          setTimeout(() => { this.infoLabel = ""}, 2000)
          this.sending = false
          this.$store.commit('SET_REPLYING_TO', undefined)
        },
      )
    },
  },
  computed: {
    ...mapGetters([
      'activeSegment',
      'peekSegment',
      'isRegistered',
      'course',
      'replyingTo'
    ]),
    hashtags() {
      return this.course.hashtag
    },
    url() {
      return `https://${this.course.slug}.connectedacademy.io/class/${this.classSlug}/live/${this.currentSegmentGroup}`
      // return `${window.location.protocol}//${window.location.host}/class/${this.classSlug}/live/${this.currentSegmentGroup}`
    },
    shortenedUrl() {
      return `${this.url.substring(0, 20)}...${this.url.substring(this.url.length - 20, this.url.length)}`
    },
    submitText() {
      if (this.sending) return 'Sending..'
      return (this.replyingTo) ? 'Reply' : 'Post'
    },
    showAction() {
      // return true // TODO // Remove this line
      return (this.messageLength > this.minCharacterCount)
    },
    messageLength() {
      return this.message.text.length
    },
  },
}
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
        svg
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
          svg
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
            radius(19px)
            margin 10px
            overflow hidden
            textarea
              animate()
              box-sizing()
              radius(19px)
              background-color transparent
              border none
              display block
              font-size 0.9em
              outline 0
              padding 10px 15px
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

</style>
