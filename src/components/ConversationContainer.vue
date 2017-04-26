<template lang="pug">

  .conversation-container(v-if="registered" v-bind:class="{ 'message-priority': messagePriority }")

    .dialogue-container

      .time-slot(v-for="(slot, index) in slots" v-bind:style="slotStyle" v-bind:class="{ active: ($store.getters.currentSectionSegment === index) }")
        p.hidden.timestamp-label {{ index }}

    .messages-container

      .time-slot(v-for="(slot, index) in slots" v-bind:style="slotStyle" v-bind:class="{ active: ($store.getters.currentSectionSegment === index) }")
        //- div(v-for="message in messages")

        message(:message="messages[index]")

    .clearfix

</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

import Message from './conversation/Message';

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
    slotStyle() {
      const heightVal = 158;
      return { height: `${heightVal}px` };
    },
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      messagePriority: true,
    };
  },
  components: {
    Message,
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
      border-color transparent
      height 108px
      animate()
      p.timestamp-label
        radius(20px)
        background-color $color-primary
        color white
        display inline-block
        line-height 40px
        min-width 20px
        margin 5px
        padding 0 10px
        text-align center

  .dialogue-container
    .time-slot
      background-color #f2f2f2

  .messages-container
    border-left $color-light-grey 1px solid
    border-color transparent
    width calc(50% - 1px)
    .time-slot
      overflow hidden
      &.active
        background-color #e1e1e1

  @media(max-width: 600px)
    &.message-priority
      .dialogue-container
        width 50px
      .messages-container
        width calc(100% - 1px - 50px)

</style>
