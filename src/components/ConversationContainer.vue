<template lang="pug">

  .conversation-container(v-if="registered")

    .dialogue-container

      .time-slot(v-for="(index, slot) in slots" v-bind:style="slotStyle")
        p.timestamp-label {{ index }}

    .messages-container

      .time-slot(v-for="slot in slots" v-bind:style="slotStyle")

        .message.visible(v-for="message in messages.data" v-bind:style="{ top: message.position + 'px' }")

          img(v-bind:src="message.user.profile")

          p
            strong {{ message.user.account }}

          p {{ ' ' + message.text }}

    .clearfix

</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {
  /* eslint-disable */

  name: 'conversation-container',
  created() {
    this.$store.dispatch('getMessages');
  },
  ready() {
    this.$nextTick(() => {
      this.getPosition();
    });
  },
  methods: {},
  computed: {
    registered() {
      return this.$store.getters.isRegistered;
    },
    slots() {
      const slots = [];
      let i = 20;
      while (i > 0) {
        slots.push(i);
        i -= 1;
      }
      return slots;
    },
    messages() {
      return this.$store.getters.messages;
    },
    dialogue() {
      return this.$store.getters.dialogue;
    },
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      slotStyle: {
        height: '158px',
      },
    };
  },
};
</script>

<style lang="stylus" scoped>
@import '../assets/stylus/shared/*'
.conversation-container
  padding 0

  .dialogue-container, .messages-container
    float left
    width 50%

    .time-slot
      background-color #f2f2f2
      border-bottom #e1e1e1 1px solid
      height 108px
      p.timestamp-label
        nomargin()
        nopadding()

  .dialogue-container
    .time-slot
      background-color blue

  .messages-container
    border-left $color-light-grey 1px solid
    width calc(50% - 1px)
    .time-slot
      background-color yellow
      overflow hidden

  .message
    margin 15px
    padding 5px 10px
    padding-left 50px

    position relative

    opacity 0

    transition opacity 1s

    img
      radius(50%)
      height 40px
      width 40px
      position absolute
      top 5px
      left 0
    p
      nomargin()
      nopadding()
      color $color-text-dark-grey
    &.visible
      opacity 1

</style>
