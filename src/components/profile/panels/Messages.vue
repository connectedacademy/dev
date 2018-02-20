<template lang="pug">

.profile-panel(v-bind:class="{ limited: limitHeight, collapsed: false, expanded: expandedView }")

  profile-panel-header(v-bind:label="`${panel.label} (${messages.length})`" v-on:refresh="loadData" v-on:expand="expand" can-refresh v-bind:can-expand="canExpand")
  
  //- .filter-search(v-if="expandedView")
    input(v-model="filterTerm" placeholder="Filter Results...")

  .profile-panel--content.no-padding
    .no-results(v-if="messages.length === 0") {{ $t('common.no_results') }}
    //- pre(v-for="(message, index) in filteredMessages") {{ message }}
    message(v-for="(message, index) in filteredMessages" v-bind:key="index" v-bind:message="message" v-bind:truncate="false" v-bind:can-jump="true" v-if="(limitHeight && (index < 4)) || !limitHeight")

</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'
import API from '@/api'

import _filter from 'lodash/filter'
import _orderBy from 'lodash/orderBy'

import ProfilePanelHeader from '@/components/profile/ProfilePanelHeader'
import StudentTile from '@/components/profile/tiles/StudentTile'

import Message from '@/components/conversation/Message'

export default {
  name: 'messages',
  props: ['panel', 'limitHeight', 'canExpand', 'expandedView'],
  components: {
    ProfilePanelHeader,
    StudentTile,
    Message
  },
  mounted() {
    this.loadData()
    EventBus.$on('profileClassUpdated', () => {
      this.loadData()
    })

    // New message added, push to list
    EventBus.$on('profileMessageReceived', (profileMessage) => {
      Vue.$log.info(profileMessage)
      if (this.panel.role === 'user') {
        if (profileMessage.msg.user.id === this.user.id) {
          this.messages.push(profileMessage.msg)
        }
      }
      else {
        this.messages.push(profileMessage.msg)
      }
    })
  },
  data() {
    return {
      messages: [],
      filterTerm: ''
    }
  },
  computed: {
    ...mapGetters(['user', 'profileClassSlug']),
    filteredMessages() {
      return _orderBy(this.messages, ['createdAt'], ['desc'])
      // _filter(this.messages, (message) => {
      //   return true
      //   // return message.account.profile === this.filterTerm
      // })
    }
  },
  methods: {
    expand() {
      this.$store.commit('updateProfileAction', this.panel)
    },
    loadData() {
      API[this.panel.role].getMessages(
        this.profileClassSlug,
        (response) => {
          this.messages = response.data
          EventBus.$emit('redrawMasonry')
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.error(response)
          this.$log.info('Failed to retrieve messages')
          this.messages = []
        }
      )
    }
  }
}

</script>

<style lang="stylus" scoped>

@import '~stylus/profile'
  
</style>