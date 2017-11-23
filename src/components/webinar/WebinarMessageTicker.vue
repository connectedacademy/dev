<template lang="pug">
  #webinar-message-ticker
    .message-wrapper(v-for="(message, index) in orderedMessages")
      message(v-bind:message="message")
    message-composer(v-if="isRegistered" static="true" v-bind:contentSlug="contentSlug" v-bind:classSlug="classSlug")
</template>

<script>
import Vue from 'vue'
import API from '@/api'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

import take from 'lodash/take'
import reverse from 'lodash/reverse'
import orderBy from 'lodash/orderBy'

import Message from '@/components/conversation/Message'
import MessageComposer from '@/components/MessageComposer'

// import Messages from '@/mixins/Messages'

export default {
  name: 'webinar-message-ticker',
  props: ['classSlug', 'contentSlug'],
  components: {
    Message,
    MessageComposer,
  },
  mounted() {
    // Subscribe to socket for content messages
    setTimeout(() => {
      this.fetchMessages()
    }, 2500)

    EventBus.$on('socketWebinarMessage', (obj) => {
      console.log('socketWebinarMessage')

      if (obj.msg.tag === `${this.classSlug}/${this.contentSlug}`) {

        Vue.$log.info('Webinar message received')
        Vue.$log.info(obj)

        Vue.$log.info('Pushing message to webinar ticker')
        this.webinarMessages.push(obj.msg)
      }
    })
  },
  data() {
    return {
      webinarMessages: []
    }
  },
  computed: {
    ...mapGetters(['isRegistered']),
    orderedMessages() {
      // Order messages
      return reverse(take(orderBy(this.webinarMessages, ['createdAt'], ['desc']), 3))
    }
  },
  methods: {
    fetchMessages() {
      const theRequest = {
        theClass: this.classSlug,
        theContent: this.contentSlug,
      }

      API.message.getContentMessages(
        theRequest,
        response => {
          this.loadingMessages = false
          this.webinarMessages = response.data
        },
        response => {
          alert('There was an error')
          this.loadingMessages = false
        }
      )
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

</style>
