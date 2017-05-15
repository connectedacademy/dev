<template lang="pug">

  .message-composer-wrapper

    .message-composer(v-bind:class="{ isactive: visible, unactive: hidden }")

      .message-composer--body
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
    box-sizing border-box

    position absolute
    bottom 0
    right 0

    height 140px
    left 224px
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

      textarea
        radius(4px)
        background-color #f9f9f9
        color black
        border none
        font-size 1em

        box-sizing border-box
        padding 15px
        resize none
        outline 0

        position absolute
        top 10px
        bottom 58px
        right 0
        left 10px
        width calc(100% - 10px)
        animate()
        @media(max-width: 800px)
          right 10px
          width calc(100% - 20px)

    .message-composer--footer
      height 38px
      padding 10px 0 10px 10px
      position absolute
      bottom 0
      right 0
      left 0
      animate()
      @media(max-width: 800px)
        padding 10px
      p.info-label
        nomargin()
        nopadding()
        color white
        line-height 38px
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
