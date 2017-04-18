<template lang="pug">

  .conversation-container

    .message.visible(v-for="message in messages.data" v-bind:style="{ top: message.position + 'px' }")

      img(v-bind:src="message.user.profile")

      p {{ message.user.name }} - {{ message.user.account }}

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

.conversation-container
  padding 0
  width 50%
  .message
    border-left $color-primary 2px solid
    margin 15px 0
    padding 5px 10px

    position relative

    opacity 0

    transition opacity 1s
    p
      nomargin()
      nopadding()
      color white
    &.visible
      opacity 1

</style>
