<template lang="pug">
  #webinar-message-ticker
    .message-wrapper(v-for="(message, index) in orderedMessages")
      message(:user="user" :message="message")
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

import _take from 'lodash/take'
import _reverse from 'lodash/reverse'
import _orderBy from 'lodash/orderBy'

import Message from '@/components/live/Message'

export default {
  name: 'webinar-message-ticker',
  props: ['classSlug', 'contentSlug'],
  components: {
    Message
  },
  mounted() {
    // Subscribe to socket for content messages
    setTimeout(() => {
      this.fetchMessages()
    }, 2500)

    EventBus.$on('socketWebinarMessage', (obj) => {
      Vue.$log.debug('socketWebinarMessage')

      if (obj.msg.tag === `${this.classSlug}/${this.contentSlug}`) {

        Vue.$log.debug('Webinar message received')
        Vue.$log.debug(obj)

        Vue.$log.debug('Pushing message to webinar ticker')
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
    ...mapGetters(['isRegistered', 'user']),
    orderedMessages() {
      // Order messages
      return _reverse(_take(_orderBy(this.webinarMessages, ['created'], ['asc']), 3))
    }
  },
  methods: {
    fetchMessages() {
      const theRequest = {
        theClass: this.classSlug,
        theContent: this.contentSlug,
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

</style>
