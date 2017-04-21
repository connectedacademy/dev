<template lang="pug">

  .conversation-container(v-if="registered")

    .message.visible(v-for="message in messages.data" v-bind:style="{ top: message.position + 'px' }")

      img(v-bind:src="message.user.profile")

      p
        strong {{ message.user.account }}

      p {{ ' ' + message.text }}

</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'conversation-container',
  created() {
    this.$store.dispatch('getMessages');
  },
  methods: {
  },
  computed: {
    registered() {
      return this.$store.getters.isRegistered;
    },
    messages() {
      return this.$store.getters.messages;
    },
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      scrollPosition: 0,
    };
  },
};
</script>

<style lang="stylus" scoped>
@import '../assets/stylus/shared/*'
.conversation-container
  padding 0
  width 50%
  .message
    margin 15px 0
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
      color white
    &.visible
      opacity 1

</style>
