<template lang="pug">
  #webinar-message-ticker
    .message-wrapper(v-for="(message, index) in orderedMessages")
      message(v-bind:message="message")
    message-composer(v-if="isRegistered" v-bind:section="contentSlug")
</template>

<script>
import Vue from 'vue';
import API from '@/api';
import { mapGetters } from 'vuex';
import take from 'lodash/take';
import reverse from 'lodash/reverse';
import orderBy from 'lodash/orderBy';

import Message from '@/components/conversation/Message';
import MessageComposer from '@/components/MessageComposer';

import Messages from '@/mixins/Messages';


export default {
  name: 'webinar-message-ticker',
  props: ['classSlug', 'contentSlug'],
  components: {
    Message,
    MessageComposer,
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
    ...mapGetters(['isRegistered']),
    orderedMessages() {
      // Order messages
      return reverse(take(orderBy(this.webinarMessages, ['createdAt'], ['desc']), 3));
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
