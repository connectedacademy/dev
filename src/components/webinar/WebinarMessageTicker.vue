<template lang="pug">
  #webinar-message-ticker
    .message-wrapper(v-for="(message, index) in orderedMessages")
      message(v-bind:message="message")

      
</template>

<script>
import Vue from 'vue';
import API from '@/api';
import _ from 'lodash';

import Message from '@/components/conversation/Message';
import Messages from '@/mixins/Messages';


export default {
  name: 'webinar-message-ticker',
  props: ['classSlug', 'contentSlug'],
  components: {
    Message,
  },
  mixins: [
    Messages,
  ],
  created() {
    // Subscribe to socket for content messages
    setTimeout(() => {
      this.fetchMessages();
    }, 2000);
  },
  data() {
    return {
      webinarMessages: [],
    }
  },
  computed: {
    orderedMessages() {
      // Order messages
      return _.reverse(_.take(_.orderBy(this.webinarMessages, ['createdAt'], ['desc']), 3));
    },
  },
  methods: {
    fetchMessages() {
      const theRequest = {
        theClass: this.classSlug,
        theContent: this.contentSlug,
      };

      API.message.getContentMessages(
        theRequest,
        response => {
          this.loadingMessages = false;
          this.webinarMessages = response.data;
        },
        response => {
          alert('There was an error');
          this.loadingMessages = false;
        },
      );
    },
  },
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

</style>
